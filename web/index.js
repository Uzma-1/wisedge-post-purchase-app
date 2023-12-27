// @ts-check
import { join, parse } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import mysql from 'mysql'
import axios from "axios";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";


var con = mysql.createConnection({
  host: "upsell-app-database.c5pjvkqxvxpv.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "06uOp0yJqFYz",
  database:'upsell_app_database'
});


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);


// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use(express.json());
// Add these headers to your server responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your actual origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Start Frontend

async function getOffers() {
  const response = await fetch('/api/graphql');
  const data = await response.json();
  // console.log("offer data", data);
  return data;
}

// Define the updateStatus function
function updateStatus(status, shop) {
  // Update the status in another table
  con.query("UPDATE another_table SET status='" + status + "' WHERE shop='" + shop + "'", function (err, res) {
    if (err) throw err;
    // console.log("Status updated in another_table");
  });
}

app.post("/api/offer", async (req, res) => {
  const token = req.body.token;
  try {
    jwt.verify(token, '52b80b1ec214ce88ac71b6744abde9ea');
  } catch (e) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const productsResponse = await getOffers();
    const products = productsResponse.data.products.edges;

    res.json({ products });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get Order
async function getAllOrders(id, shop, token) {
  const ordersPerPage = 10; // Number of orders to fetch per page
  let hasNextPage = true; // Flag to track if there are more pages
  let cursor = null; // Initialize the cursor to null

  const allOrders = []; // Array to store all orders

  while (hasNextPage) {
    try {
      let data = JSON.stringify({
        "query": "query($customerId: ID!, $ordersPerPage: Int!, $cursor: String) { customer(id: $customerId) { id displayName orders(first: $ordersPerPage, after: $cursor) { pageInfo { hasNextPage endCursor } edges { node { id name tags totalPriceSet { shopMoney { amount currencyCode } } lineItems(first: 5) { edges { node { id title quantity variant { title price } } } } } } } } }",
        "variables": {
          "customerId": `gid://shopify/Customer/${id}`,
          "ordersPerPage": ordersPerPage,
          "cursor": cursor
        }
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${shop}/admin/api/unstable/graphql.json`,
        headers: { 
          'X-Shopify-Access-Token': token, 
          'Content-Type': 'application/json', 
          'Cookie': 'request_method=POST'
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('GraphQL Response:', response.data);

      // Add the orders to the allOrders array
      allOrders.push(...response.data.data.customer.orders.edges.map(orderEdge => orderEdge.node));

      // Update cursor and hasNextPage based on the response
      cursor = response.data.data.customer.orders.pageInfo.endCursor;
      hasNextPage = response.data.data.customer.orders.pageInfo.hasNextPage;
    } catch (error) {
      throw error;
    }
  }

  return allOrders;
}


// Function to make a GraphQL request to update order tags
async function updateOrderTags(id, shop, tags, token) {
  try {
    // Construct the GraphQL mutation
    const mutation = `
      mutation UpdateOrderTags($orderId: ID!, $tags: [String!]!) {
        orderUpdate(input: { id: $orderId, tags: $tags }) {
          order {
            id
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Define the variables for the mutation
    const variables = {
      orderId: id,
      tags: tags,
    };

    // Make the GraphQL request to update the order tags
    const response = await axios.post(`https://${shop}/admin/api/unstable/graphql.json`, {
      query: mutation,
      variables: variables,
    }, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    // Handle the response
    if (response.status === 200) {
      console.log('Order tags updated successfully.');
      console.log(JSON.stringify(response.data));

      // Return the updated order details
      return response.data.data.orderUpdate.order;
    } else {
      console.error('Failed to update order tags. Status:', response.status);
    }
  } catch (error) {
    console.error('Error updating order tags:', error);
  }
}


// Initialize an object to track processed interactions
const tagsToAdd = ['Wisedge']; // Specify the tags to add

app.post("/api/sign-changeset", async (req, res) => {
  try {
    // Verify the JWT token
    jwt.verify(req.body.token, '52b80b1ec214ce88ac71b6744abde9ea');

    const productId = req.body;
    const customerId = req.body.customerId;
    const proVariant = productId.changes;
    const shop = req.body.shop;
    let isOrderFromPostPurchaseApp = req.body.isOrderFromPostPurchaseApp;

    con.query("SELECT * FROM shop WHERE shop='"+shop+"'", async function (err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send("Database error");
        return;
      }

      var tokenFinal = result[0]['access_token'];
      var customer_detail = [];
      // Initialize order_detail as null
      let order_detail = [];
      var currentOrderId = '';

      console.log("isOrderFromPostPurchaseApp:", isOrderFromPostPurchaseApp);

      // Check if this order is from the post-purchase app
      if (isOrderFromPostPurchaseApp === true) {
        // You might need to implement logic here to determine if this order is from applychangeset

        customer_detail = await getAllOrders(customerId, shop, tokenFinal);

      
        // Get the last order in the list (if any)
        const lastOrderIndex = customer_detail.length - 1;
        if (lastOrderIndex >= 0) {
          const lastOrder = customer_detail[lastOrderIndex];
          currentOrderId = lastOrder.id;

          console.log('currentOrderId', currentOrderId);

          // Define the tags to add for the current order
          const tags = tagsToAdd;

          // Update order tags using the updateOrderTags function
          try {
            order_detail = await updateOrderTags(currentOrderId, shop, tags, tokenFinal);
          } catch (updateError) {
            console.error(updateError);
            res.status(500).send("Error updating order tags");
            return;
          }
        } else {
          console.log('No orders found.');
        }

        // If order_detail is still null, it means no matching order was found
        if (order_detail === null) {
          console.log('No matching order found.');
          res.status(404).send("Order not found");
          return;
        }
      } else {
        console.log('This order is not from the post-purchase app.');
      }

      console.log('customer_detail', customer_detail);
      console.log('order_detail', order_detail);

      const payload = {
        iss: 'b6b37c551b0463e41f7064f97923ecc9',
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000),
        sub: req.body.referenceId, // Use the current order's ID as the identifier
        changes: [
          {
            type: "add_variant",
            variantID: proVariant,
            quantity: 1,
            discount: {
              value: 10,
              valueType: "percentage",
              title: "10% off",
            },
          },
        ],
      };
      const token = jwt.sign(payload, '52b80b1ec214ce88ac71b6744abde9ea');

      const responseObj = { 
        token: token, 
        customer_detail: customer_detail,
        order_detail: order_detail,
      };
      res.status(200).json(responseObj);
    });
  } catch (e) {
    console.error(e);
    res.status(401).send("Unauthorized");
  }
});


// Accept Product Data
function getAcceptProductData(id,shop,token){
  let data = JSON.stringify({
    query: `{
  product(id: "gid://shopify/Product/`+id+`") {
        title
        id
        legacyResourceId
        variants(first: 10) {
            edges {
                node {
                    id
                    price
                    compareAtPrice
                    legacyResourceId
                }
            }
        }
        description
        images(first: 5) {
            edges {
                node {
                altText
                originalSrc
                }
            }
            }
  }
  }`,
    variables: {}
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${shop}/admin/api/unstable/graphql.json`,
    headers: { 
      'X-Shopify-Access-Token': token, 
      'Content-Type': 'application/json', 
      'Cookie': 'request_method=POST'
    },
    data : data
  };
  
  //let product_data = '';

  return axios.request(config)
  .then((response) => {
    return JSON.stringify(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
  
}


// get Decline Offer Data
function  getDeclineProductData(id, shop, token){
  let data = JSON.stringify({
    query: `{
  product(id: "gid://shopify/Product/`+id+`") {
        title
        id
        legacyResourceId
        variants(first: 10) {
            edges {
                node {
                    id
                    price
                    compareAtPrice
                    legacyResourceId
                }
            }
        }
        description
        images(first: 5) {
            edges {
                node {
                altText
                originalSrc
                }
            }
            }
  }
  }`,
    variables: {}
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${shop}/admin/api/unstable/graphql.json`,
    headers: { 
      'X-Shopify-Access-Token': token, 
      'Content-Type': 'application/json', 
      'Cookie': 'request_method=POST'
    },
    data : data
  };
  
  //let product_data = '';

  return axios.request(config)
  .then((response) => {
    return JSON.stringify(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
  
}


app.post("/api/get-offer", cors(), async (req, res) => {

  const productarray = req.body;
  const shop = req.body.shop;
  var pro_arr = productarray['productarray'];
  var join_arr = pro_arr.join(",");


  con.query("SELECT * FROM  shop WHERE shop='"+shop+"'", function (err, result, fields) {
    if (err) throw err;
      // console.log("Result",result);
    var token_final = result[0]['access_token'];
    var status = result[0]['status'];
    // console.log('status', status);

    if(status == 'true') {
      const getOffer = `SELECT *  FROM funnel WHERE main_product_id IN (${join_arr}) AND funnel_status = 'published' AND shop = '${shop}' LIMIT 1`;
      con.query(getOffer, (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err);
        return;
      }

      if(rows.length==0){
      var data_res = {
        status: false
      }; 
      res.send(data_res);
      }
      else{
        
      var acc_pro_id = rows[0]['accept_product_id'];

      const product_detail = getAcceptProductData(acc_pro_id,shop,token_final)
      .then(result => {
        res.send(result);
        // console.log('result????', result); // Process the retrieved data
      })
      .catch(error => {
        console.error(error); // Handle any errors that occurred
      });
      }
      });
    } else {
      var data_res = {
        status: false
      }; 
      res.send(data_res);
    }

  
}); 
});


// Decline Offer

app.post("/api/decline-offer", async (req, res) => {
const productarray = req.body;
var pro_arr = productarray['productarray'];
var join_arr = pro_arr.join(",");
const shop = req.body.shop;
con.query("SELECT * FROM  shop WHERE shop='"+shop+"'", function (err, result, fields) {
  if (err) throw err;
    // console.log("Result",result);
  var token_final = result[0]['access_token'];

const getOffer = `SELECT * FROM funnel WHERE main_product_id IN (${join_arr})`;

con.query(getOffer, (err, rows) => {
  if (err) {
    console.error('Error retrieving data:', err);
    return;
  }

  if (rows.length == 0) {
    var data_res = {
      status: false
    };
    res.send(data_res);
  } else {
    var dec_pro_id = rows[0]['decline_product_id'];

    // Assuming you have a function to fetch decline product data
    getDeclineProductData(dec_pro_id, shop, token_final)
      .then(result => {
        res.send(result);
        // console.log('decline result', result); // Process the retrieved data
      })
      .catch(error => {
        console.error(error); // Handle any errors that occurred
      });
  }
});
});
});

app.post("/api/decline-changeset", cors(), async (req, res) => {
  // console.log('decline changeset', req.body);
  try {
    jwt.verify(req.body.token, '52b80b1ec214ce88ac71b6744abde9ea');

    const productId = req.body;
    const customerId = req.body.customerId;
    const proVariant = productId.changes;
    const shop = req.body.shop;
    let isOrderFromPostPurchaseApp = req.body.isOrderFromPostPurchaseApp;

    con.query("SELECT * FROM shop WHERE shop='"+shop+"'", async function (err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send("Database error");
        return;
      }

      var tokenFinal = result[0]['access_token'];
      var customer_detail = [];
      // Initialize order_detail as null
      let order_detail = [];
      var currentOrderId = '';

      console.log("isOrderFromPostPurchaseApp:", isOrderFromPostPurchaseApp);

      // Check if this order is from the post-purchase app
      if (isOrderFromPostPurchaseApp === true) {
        // You might need to implement logic here to determine if this order is from applychangeset

        customer_detail = await getAllOrders(customerId, shop, tokenFinal);

      
        // Get the last order in the list (if any)
        const lastOrderIndex = customer_detail.length - 1;
        if (lastOrderIndex >= 0) {
          const lastOrder = customer_detail[lastOrderIndex];
          currentOrderId = lastOrder.id;

          console.log('currentOrderId', currentOrderId);

          // Define the tags to add for the current order
          const tags = tagsToAdd;

          // Update order tags using the updateOrderTags function
          try {
            order_detail = await updateOrderTags(currentOrderId, shop, tags, tokenFinal);
          } catch (updateError) {
            console.error(updateError);
            res.status(500).send("Error updating order tags");
            return;
          }
        } else {
          console.log('No orders found.');
        }

        // If order_detail is still null, it means no matching order was found
        if (order_detail === null) {
          console.log('No matching order found.');
          res.status(404).send("Order not found");
          return;
        }
      } else {
        console.log('This order is not from the post-purchase app.');
      }

      console.log('customer_detail', customer_detail);
      console.log('order_detail', order_detail);

      const payload = {
        iss: 'b6b37c551b0463e41f7064f97923ecc9',
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000),
        sub: req.body.referenceId, // Use the current order's ID as the identifier
        changes: [
          {
            type: "add_variant",
            variantID: proVariant,
            quantity: 1,
            discount: {
              value: 10,
              valueType: "percentage",
              title: "10% off",
            },
          },
        ],
      };
      const token = jwt.sign(payload, '52b80b1ec214ce88ac71b6744abde9ea');

      const responseObj = { 
        token: token, 
        customer_detail: customer_detail,
        order_detail: order_detail,
      };
      res.status(200).json(responseObj);
    });
  } catch (e) {
    res.status(401).send("Unauthorized");
    return;
  }
});

app.use("/api/*", shopify.validateAuthenticatedSession());

function getToken(shop){
  con.query("SELECT * FROM  shop WHERE shop='"+shop+"'", function (err, result, fields) {
    if (err) throw err;
      // console.log("Result",result);
    return result;
  }); 
}

// Get Shop Token
app.get('/api/shopToken', (req, res) => {
  var session_data = res.locals.shopify.session;
  // console.log('session_data', session_data);
  var shop = session_data['shop'];
  var token = session_data['accessToken'];
  // console.log('token??', token);
  con.query("SELECT * FROM  shop WHERE shop='"+shop+"'", function (err, result, fields) {
    if (err) throw err;

    var result_data = result;
    const date = new Date().toJSON().slice(0, 10);
    console.log('shopToken date', date);
        if(result_data.length>0){
         if(result[0].access_token === token) {
            console.log("Token already exist");
         } else {
          con.query("UPDATE shop SET access_token='"+token+"', date='"+date+"' WHERE shop='"+shop+"'", function (eror, res, field) {
            if (err) throw err;    
          });
         }
        }
        else{
          con.query("INSERT INTO shop (shop,access_token,status,date) VALUES('"+shop+"','"+token+"','true','"+date+"')", function (eror, res, field) {
                if (err) throw err;    
          });
        }

    res.send(result);
  });
});


// Update App Status

app.put('/api/shopStatus', async (req, res) => {
  const shopId = req.body.Id;
  const newStatus = req.body.status;
  // console.log('newStatus??', req.body);

  const shopStatus = `UPDATE shop SET status = '${newStatus}' WHERE Id = ${shopId}`;
  con.query(shopStatus, (err, rows) => {
    if (err) {
      console.error('Error funnel status retrieving data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // console.log('funnelStatus', shopStatus);
    // console.log('Edit Funnel Status retrieved:', rows);
    res.send({
      userId: shopId,
      data: rows
    });
  });
});


// Function to fetch sales data
async function getSales(shop, token, cursor, finalDate, tagQuery) {
  let query = '';
  if(cursor == '') {
    query = `
    {
      shop {
        orders(first: 10, query: "created_at:>${finalDate}T00:00:00Z ${tagQuery}", sortKey: CREATED_AT) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
              tags
            }
          }
        }
      }
    }
  `;
  } else {
  query = `
    {
      shop {
        orders(first: 10, after: "${cursor}", query: "created_at:>${finalDate}T00:00:00Z ${tagQuery}", sortKey: CREATED_AT) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
              tags
            }
          }
        }
      }
    }
  `;
  }
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${shop}/admin/api/unstable/graphql.json`,
    headers: { 
      'X-Shopify-Access-Token': token, 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({ query }),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
}

// Function to calculate the average of an array
function calculateAverage(arr) {
  if (arr.length === 0) {
    return 0;
  }
  
  const sum = arr.reduce((total, value) => total + value, 0);
  return sum / arr.length;
}

// Get Store Sale
app.post('/api/order', async (req, res) => {
  var session_data = res.locals.shopify.session;
  var shop = session_data['shop'];
  var token = session_data['accessToken'];

  const getData = `SELECT date from shop WHERE shop = '${shop}'`
  con.query(getData, async (err, rows) => {
    // Format dates
    console.log("order date", rows);
    const saleDate = new Date(rows[0]['date']).toJSON().slice(0, 10);
    const todayDate = new Date().toJSON().slice(0, 10);

    // Fetch sales data for all tags (including blank tags)
    let cursor = '';
    let totalSalesAllTags = 0;
    let allTagOrders = []; // Store all orders with tags for later use

    while (true) { // Infinite loop to gather all orders
      const orderRes = await getSales(shop, token, cursor, saleDate, '');

      if (!orderRes || !orderRes.data || !orderRes.data.shop || !orderRes.data.shop.orders || !orderRes.data.shop.orders.edges) {
        // Break if there's no more data or an unexpected response
        break;
      }

      const orderData = orderRes.data.shop.orders;
      const edges = orderData.edges;

      if (edges.length === 0) {
        // No more orders, break the loop
        break;
      }

      cursor = orderData.pageInfo.endCursor;

      for (const order of edges) {
        const newAmount = parseFloat(order.node.totalPriceSet.shopMoney.amount);
        totalSalesAllTags += newAmount;
        allTagOrders.push(order); // Store all orders for later use
      }
    }

    totalSalesAllTags = totalSalesAllTags.toFixed(2);

    // Calculate the average sale for all tags
    const averageSaleAllTags = calculateAverage(allTagOrders.map(order => parseFloat(order.node.totalPriceSet.shopMoney.amount))).toFixed(2);

    // Fetch sales data using Wisedge tags
    cursor = '';
    let totalSalesWisedge = 0;

    while (true) { // Infinite loop to gather all Wisedge orders
      const orderRes = await getSales(shop, token, cursor, saleDate, 'tag:Wisedge');

      if (!orderRes || !orderRes.data || !orderRes.data.shop || !orderRes.data.shop.orders || !orderRes.data.shop.orders.edges) {
        // Break if there's no more data or an unexpected response
        break;
      }

      const orderData = orderRes.data.shop.orders;
      const edges = orderData.edges;

      if (edges.length === 0) {
        // No more Wisedge orders, break the loop
        break;
      }

      cursor = orderData.pageInfo.endCursor;

      for (const order of edges) {
        const newAmount = parseFloat(order.node.totalPriceSet.shopMoney.amount);
        totalSalesWisedge += newAmount;
      }
    }

    totalSalesWisedge = totalSalesWisedge.toFixed(2);

    // Fetch today's sales and calculate average using Wisedge tags
    const todayOrderRes = await getSales(shop, token, '', todayDate, 'tag:Wisedge');
    const todayOrderData = todayOrderRes.data.shop.orders.edges;
    let todaySales = 0;
    const avgOrder = [];

    for (const order of todayOrderData) {
      const newAmount = parseFloat(order.node.totalPriceSet.shopMoney.amount);
      todaySales += newAmount;
      avgOrder.push(newAmount);
    }

    todaySales = todaySales.toFixed(2);
    const avg = calculateAverage(avgOrder);

    // Calculate the average order value
    const numberOfOrdersToday = todayOrderData.length;
    const avgOrderValue = numberOfOrdersToday > 0 ? todaySales / numberOfOrdersToday : 0;
    const upsellAverage = avgOrderValue.toFixed(2);

    res.send({
      total_sales_all_tags: totalSalesAllTags,
      average_sale_all_tags: averageSaleAllTags,
      total_sales_wisedge: totalSalesWisedge,
      today_sales: todaySales,
      upsell_avrg: upsellAverage,
    });
  });
});



// Get Graphql
app.get('/api/graphql', (req, res) => {
  var session_data = res.locals.shopify.session;

  // console.log('session_data', session_data);
  var shop = session_data['shop'];
  var token = session_data['accessToken'];
  let data = JSON.stringify({
  query: `{
  products(first: 50) {
    edges {
      node {
        title
        legacyResourceId
        variants(first: 1) {
            edges {
                node {
                    id
                    price
                    compareAtPrice
                }
            }
        }
        description
        images(first: 5) {
            edges {
                node {
                altText
                originalSrc
                }
            }
            }
      }
    }
  }
  }`,
  variables: {}
  });
  
  let config = {
  method: 'post',
  url: `https://${shop}/admin/api/unstable/graphql.json`,
  headers: { 
    'X-Shopify-Access-Token': token, 
    'Content-Type': 'application/json', 
  },
  data : data
  };
  
  axios.request(config)
  .then((response) => {
  // console.log(JSON.stringify(response.data));
  res.send(response.data)
  })
  .catch((error) => {
  console.log(error);
  });
  })


// Get Funnel
app.get("/api/get-funnel",(_req,res)=>{
  var session_data = res.locals.shopify.session;
  var shop = session_data['shop'];
  const getData = `SELECT * from funnel WHERE shop = '${shop}'`
  con.query(getData, (err, rows) => {
  if (err) {
    console.error('Error retrieving data:', err);
    return;
  }
  // console.log('Combine Data retrieved:', rows);
  res.send(rows);
  // console.log('funnel rows', rows);
  });

});

// Funnel Status Update
app.put("/api/update-funnel-status/:Id",(req,res)=>{
  const funnelId = req.params.Id;
  const newStatus = req.body.funnel_status;
  // console.log('newStatus', funnelId);

  const funnelStatus = `UPDATE funnel SET funnel_status = '${newStatus}' WHERE Id = ${funnelId}`;
  con.query(funnelStatus, (err, rows) => {
    if (err) {
      console.error('Error funnel status retrieving data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // console.log('funnelStatus', funnelStatus);
    // console.log('Edit Funnel Status retrieved:', rows);
    res.send({
      userId: funnelId,
      data: rows
    });
  });

})

// Add Funnel
app.post('/api/update-funnel', (req, res) => {
  var session_data = res.locals.shopify.session;
  var shop_name = session_data['shop'];

  var data = req.body;
  var funnel_name = data?.funnel_name;
  var funnel_status = data?.funnel_status;
  var funnel_trigger = data?.funnel_trigger;
  var main_product_id = data?.main_product_id;
  var accept_product_id = data?.accept_product_id;
  var decline_product_id = data?.decline_product_id;
  var accept_status = data?.accept_status;
  var decline_status = data?.decline_status;
  var shop = shop_name;

  // console.log('update funnel data', decline_product_id);
  
  const sql = 'INSERT INTO funnel (funnel_name, funnel_status, funnel_trigger, main_product_id, accept_product_id, decline_product_id, accept_status, decline_status, shop) VALUES ("'+funnel_name+'","'+funnel_status+'","'+funnel_trigger+'",'+ main_product_id+','+accept_product_id+','+decline_product_id+',"'+accept_status+'","'+decline_status+'","'+shop+'")';
  // console.log("sql",sql);
  con.query(sql, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err);
    return;
  }
  // console.log('Data inserted successfully', result, sql);
});
// Product Table
const product_data = data?.product_data;
  
const tables = ['main_pro_table', 'accept_pro_table', 'decline_pro_table'];

for (const table of tables) {
const entry = product_data[table];
const product_id = entry['product_id'];
const image = entry['image'];
const title = entry['title'];
const price = entry['price'];

const pro_sql = `INSERT INTO products (product_id, image, title, price, shop) VALUES ("${product_id}", "${image}", "${title}", "${price}", "${shop}")`;

// console.log("pro_Sql", pro_sql);

con.query(pro_sql, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err);
    return;
  }
  // console.log('Data inserted successfully', result, pro_sql);
});
// console.log("req",req.body);
var data = req.body
}  
res.send(data);
});

// Edit Funnel
  app.get('/api/editFunnel/:Id', (req, res) => {
    const userId = req.params.Id;
    // console.log('userId', req.params.Id);
  
    const editData = `SELECT *  FROM funnel JOIN products ON funnel.Id = '${userId}' WHERE funnel.main_product_id = products.product_id OR funnel.accept_product_id = products.product_id OR funnel.decline_product_id = products.product_id GROUP BY products.product_id`;
  
    con.query(editData, (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // console.log('Edit Funnel Data retrieved:', rows);
      res.send({
        userId: userId,
        data: rows
      });
    });
  });

// update edit funnel
  app.put('/api/editFunnel/:Id', (req, res) => {
  const proId = req.params.Id;
  const data = req.body;
  const funnel_name = data?.funnel_name;
  const funnel_status = data?.funnel_status;
  const funnel_trigger = data?.funnel_trigger;
  const main_product_id = data?.main_product_id;
  const accept_product_id = data?.accept_product_id;
  const decline_product_id = data?.decline_product_id;
  const accept_status = data?.accept_status;
  const decline_status = data?.decline_status;

  const funnelSql = `UPDATE funnel SET funnel_name = '${funnel_name}', funnel_status = '${funnel_status}', funnel_trigger = '${funnel_trigger}', main_product_id = '${main_product_id}', accept_product_id = '${accept_product_id}', decline_product_id = '${decline_product_id}', accept_status = '${accept_status}', decline_status = '${decline_status}' WHERE Id = ${proId}`;

  con.query(funnelSql, (err, result) => {
    if (err) {
      console.error('Error inserting funnel data:', err);
      res.status(500).json({ error: 'Failed to insert funnel data' });
      return;
    }
    // console.log('Funnel data inserted successfully:', result);
    res.send({
      proId: proId,
      data: result
    });
  });

});
  

// Delete Funnel
app.delete('/api/delete-funnel/:Id', (req, res) => {
  const proId = req.params.Id;
  // console.log('proId', proId);

  const deleteSql = `DELETE FROM funnel WHERE Id = ${proId}`;

  con.query(deleteSql, (err, result) => {
    if (err) {
      console.error('Error deleting funnel data:', err);
      res.status(500).json({ error: 'Failed to delete funnel data' });
      return;
    }
    // console.log('Funnel data deleted successfully:', result);
    res.send({
      proId: proId,
      data: result
    });
  });

});
  




// Product Count
app.get("/api/products/count", async (_req, res) => {
  // console.log("rtttt",res.locals.shopify.session);
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    // console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
