import { useEffect, useState} from "react";
import {
  extend,
  render,
  useExtensionInput,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Text,
  TextContainer,
  Separator,
  Tiles,
  TextBlock,
  Layout,
} from "@shopify/post-purchase-ui-extensions-react";


// For local development, replace APP_URL with your local tunnel URL.
const APP_URL = "https://funnel-app-b09c45e1570a.herokuapp.com";

// Preload data from your app server to ensure that the extension loads quickly.
extend("Checkout::PostPurchase::ShouldRender", async ({ inputData }) => {

  const orderId = inputData.orderId;
  const orderTotal = inputData.orderTotal;

  // console.log("Order ID:", orderId);
  // console.log("Order Total:", orderTotal);

  
  // Return the result of the post-purchase check
  return { render: true };
});



render("Checkout::PostPurchase::Render", () => <App />);

export function App() {
  const { storage, inputData, calculateChangeset, applyChangeset, done } =
    useExtensionInput();
  const [acceptOfferLoading, setAcceptOfferLoading] = useState(false);
  const [declineOfferLoading, setDeclineOfferLoading] = useState(false);
  const [calculatedPurchase, setCalculatedPurchase] = useState();
  const [calculateAcceptOffer, setCalculateAcceptOffer] = useState();
  const [calculateDeclineOffer, setCalculateDeclineOffer] = useState();
  const [acceptProData, setAccpetProData] = useState();
  const [declineProData, setDeclineProData] = useState();
  const [declineOfferClicked, setDeclineOfferClicked] = useState(false);
  const dataObject = JSON.parse(storage.initialData);
  const purchaseOption = dataObject;
  var line_items = inputData?.initialPurchase?.lineItems;
  var customer_id = inputData?.initialPurchase?.customerId;
  var shop = inputData?.shop?.domain;
  var productarray = [];

  for(var i=0;i<line_items?.length;i++){
    var product_id = line_items[i]['product']['id'];
    productarray[i] = product_id;
    // console.log('line_items', line_items);
  }
  console.log("productarray",inputData);


    // Accept Offer
    async function sendProductData(){
      try {
        console.log("get offer function");
        const response = await fetch(`${APP_URL}/api/get-offer`, {
          method: 'POST',
          mode: 'cors',
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            productarray: productarray,
            shop: shop
          }),
        });
        console.log("get offer function bottom");
        const data = await response.json();
        var resp = data?.data;
        if(resp == undefined){
          done();
          return false;
        }
        else{
          setAccpetProData(data?.data);
        }            
      } catch (error) {
        console.log(error);
      }
    }

    // Decline Offer
    async function declineOfferData() {
      setDeclineOfferLoading(true);
          try {
            const response = await fetch(`${APP_URL}/api/decline-offer`, {
              method: 'POST',
              mode: 'cors',
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
              body: JSON.stringify({
                productarray: productarray,
                shop: shop,
              }),
            });
      
            const data = await response.json();
            setDeclineProData(data?.data);
            // console.log('decline resp', declineProData);
            setDeclineOfferClicked(true);
            // Set loading to false when done
            setDeclineOfferLoading(false);
          } catch (error) {
            console.log(error);
            setDeclineOfferLoading(false);
          }
    }

    
  const pro_img = acceptProData?.product?.images?.edges[0]?.node?.originalSrc;
  const pro_title = acceptProData?.product?.title;
  const pro_variant_id = +acceptProData?.product?.variants?.edges[0]?.node?.legacyResourceId;
  const pro_main_price = acceptProData?.product?.variants?.edges[0]?.node?.price;
  const shipping = calculatedPurchase?.addedShippingLines[0]?.priceSet?.presentmentMoney?.amount;
  const taxes = calculatedPurchase?.addedTaxLines[0]?.priceSet?.presentmentMoney?.amount;
  const total = calculatedPurchase?.totalOutstandingSet.presentmentMoney.amount;
  const discountedPrice = calculatedPurchase?.updatedLineItems[0].totalPriceSet.presentmentMoney.amount;
  const originalPrice = calculatedPurchase?.updatedLineItems[0].priceSet.presentmentMoney.amount;
  const decline_shipping = calculateDeclineOffer?.addedShippingLines[0]?.priceSet?.presentmentMoney?.amount;
  const decline_taxes = calculateDeclineOffer?.addedTaxLines[0]?.priceSet?.presentmentMoney?.amount;
  const decline_total = calculateDeclineOffer?.totalOutstandingSet.presentmentMoney.amount;
  const decline_discountedPrice = calculateDeclineOffer?.updatedLineItems[0].totalPriceSet.presentmentMoney.amount;
  const decline_originalPrice = calculateDeclineOffer?.updatedLineItems[0].priceSet.presentmentMoney.amount;
  const decline_pro_img = declineProData?.product?.images?.edges[0]?.node?.originalSrc;
  const decline_pro_title = declineProData?.product?.title;
  const decline_pro_variant_id = +declineProData?.product?.variants?.edges[0]?.node?.legacyResourceId;
  const decline_pro_main_price = declineProData?.product?.variants?.edges[0]?.node?.price;

  // console.log('calculatedPurchase', calculatedPurchase);


  // Define the changes that you want to make to the purchase, including the discount to the product.
  useEffect(() => {
    async function calculatePurchase(pro_variant_id) {
      const data = [
        {
          type: "add_variant",
          variantId: pro_variant_id,
          quantity: 1
        }
      ];      
      // Call Shopify to calculate the new price of the purchase, if the above changes are applied.
      const result = await calculateChangeset({
        changes: data,
      });

    setCalculatedPurchase(result.calculatedPurchase);
    setAcceptOfferLoading(false);
    }


    // Decline Calculate Offer
    async function calculateDeclineOffer(decline_pro_variant_id) {
      const declineData = [
        {
          type: "add_variant",
          variantId: decline_pro_variant_id,
          quantity: 1
        }
      ];
  
      // Call Shopify to calculate the decline offer changes
      const result = await calculateChangeset({
        changes: declineData,
      });

    setCalculateDeclineOffer(result.calculatedPurchase);
    setDeclineOfferLoading(false);
    }


    if (pro_variant_id) {
      Promise.all([calculatePurchase(pro_variant_id)]);
    }

    if (decline_pro_variant_id) {
      Promise.all([calculateDeclineOffer(decline_pro_variant_id)]);
    }

    sendProductData();
  }, [decline_pro_variant_id, pro_variant_id]);


   // Extract values from the calculated purchase.
   

   async function acceptOffer() {
    setAcceptOfferLoading(true);
  
    try {
      // Make a request to your app server to sign the changeset with your app's API secret key.
      const tokenData = await fetch(`${APP_URL}/api/sign-changeset`, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          referenceId: inputData.initialPurchase.referenceId,
          changes: pro_variant_id,
          token: inputData.token,
          customerId: customer_id,
          shop: shop,
          isOrderFromPostPurchaseApp: true
        }),
      });
  
      if (tokenData.status == 200) {
        const resp = await tokenData.json();
        console.log('Response from sign-changeset:', resp);
  
        // Proceed with applying the changeset if necessary
        await applyChangeset(resp.token);
  
        // Redirect to the thank-you page or perform any other necessary actions.
        setTimeout(function(){
          done();
        }, 3000);
        
      } else {
        console.error('Failed to sign changeset. Status:', tokenData.status);
      }
    } catch (error) {
      console.error('Error in acceptOffer:', error);
      // Handle errors appropriately
    } finally {
      setAcceptOfferLoading(false);
    }
  }
  
 
  async function declineOffer() {
    setAcceptOfferLoading(true);
     
  try{
    const token = await fetch(`${APP_URL}/api/decline-changeset`, {
     method: 'POST',
     mode: 'cors',
     headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
     body: JSON.stringify({
       referenceId: inputData.initialPurchase.referenceId,
       changes: decline_pro_variant_id,
       token: inputData.token,
       customerId: customer_id,
       shop: shop,
       isOrderFromPostPurchaseApp: true
     }),
   })
   if (token.status == 200) {
    const resp = await token.json();
    console.log('Response from sign-changeset:', resp);

    // Proceed with applying the changeset if necessary
    await applyChangeset(resp.token);

    // Redirect to the thank-you page or perform any other necessary actions.
    setTimeout(function(){
      done();
    }, 3000);
    
  } else {
    console.error('Failed to sign changeset. Status:', tokenData.status);
  }
} catch (error) {
  console.error('Error in acceptOffer:', error);
  // Handle errors appropriately
} finally {
  setAcceptOfferLoading(false);
}
}
 
  function finalDeclineOffer(){
    setDeclineOfferLoading(true);
   done();
  }
 


 return (
   <>
      {
      declineOfferClicked ?
      <BlockStack spacing="loose">
        <CalloutBanner>
          <BlockStack spacing="tight">
            <TextContainer>
              <Text size="medium" emphasized>
                It&#39;s not too late to add this to your order
              </Text>
            </TextContainer>
            <TextContainer>
              <Text size="medium">Add the {decline_pro_title} to your order and </Text>
              <Text size="medium" emphasized>
                {purchaseOption?.changes[0]?.discount.title}
              </Text>
            </TextContainer>
          </BlockStack>
        </CalloutBanner>
        <Layout
          media={[
            {viewportSize: 'small', sizes: [1, 0, 1], maxInlineSize: 0.9},
            {viewportSize: 'medium', sizes: [532, 0, 1], maxInlineSize: 420},
            {viewportSize: 'large', sizes: [560, 38, 340]},
          ]}
        >
          <Image description="product photo" source={decline_pro_img} />
          <BlockStack />
          <BlockStack>
            <Heading>{decline_pro_title}</Heading>
            <PriceHeader
              discountedPrice={decline_pro_main_price}
              originalPrice={decline_pro_main_price}
              loading={!calculatedPurchase}
            />
            <ProductDescription textLines={purchaseOption?.productDescription} />
            <BlockStack spacing="tight">
              <Separator />
              <MoneyLine
                label="Subtotal"
                amount={decline_discountedPrice}
                loading={!calculatedPurchase}
              />
              <MoneyLine
                label="Shipping"
                amount={decline_shipping}
                loading={!calculatedPurchase}
              />
              <MoneyLine
                label="Taxes"
                amount={decline_taxes}
                loading={!calculatedPurchase}
              />
              <Separator />
              <MoneySummary
                label="Total"
                amount={decline_total}
                loading={!calculatedPurchase}
              />
            </BlockStack>
            <BlockStack>
              <Button onPress={declineOffer} submit loading={acceptOfferLoading}>
                Pay now · {formatCurrency(decline_total)}
              </Button>
              <Button onPress={finalDeclineOffer} subdued loading={declineOfferLoading}>
                Decline this offer
              </Button>
            </BlockStack>
          </BlockStack>
        </Layout>
      </BlockStack>
      :
      <BlockStack spacing="loose">
     <CalloutBanner>
       <BlockStack spacing="tight">
         <TextContainer>
           <Text size="medium" emphasized>
             It&#39;s not too late to add this to your order
           </Text>
         </TextContainer>
         <TextContainer>
           <Text size="medium">Add the {pro_title} to your order and </Text>
           <Text size="medium" emphasized>
             {purchaseOption?.changes[0]?.discount.title}
           </Text>
         </TextContainer>
       </BlockStack>
     </CalloutBanner>
     <Layout
       media={[
         {viewportSize: 'small', sizes: [1, 0, 1], maxInlineSize: 0.9},
         {viewportSize: 'medium', sizes: [532, 0, 1], maxInlineSize: 420},
         {viewportSize: 'large', sizes: [560, 38, 340]},
       ]}
     >
       <Image description="product photo" source={pro_img} />
       <BlockStack />
       <BlockStack>
         <Heading>{pro_title}</Heading>
         <PriceHeader
           discountedPrice={pro_main_price}
           originalPrice={pro_main_price}
           loading={!calculatedPurchase}
         />
         <ProductDescription textLines={purchaseOption?.productDescription} />
         <BlockStack spacing="tight">
           <Separator />
           <MoneyLine
             label="Subtotal"
             amount={discountedPrice}
             loading={!calculatedPurchase}
           />
           <MoneyLine
             label="Shipping"
             amount={shipping}
             loading={!calculatedPurchase}
           />
           <MoneyLine
             label="Taxes"
             amount={taxes}
             loading={!calculatedPurchase}
           />
           <Separator />
           <MoneySummary
             label="Total"
             amount={total}
             loading={!calculatedPurchase}
           />
         </BlockStack>
         <BlockStack>
           <Button onPress={acceptOffer} submit loading={acceptOfferLoading}>
             Pay now · {formatCurrency(total)}
           </Button>
           <Button onPress={declineOfferData} subdued loading={declineOfferLoading}>
             Decline this offer
           </Button>
         </BlockStack>
       </BlockStack>
      </Layout>
    </BlockStack>
   }
   </>
 );
}

function PriceHeader({discountedPrice, originalPrice, loading}) {
 return (
   <TextContainer alignment="leading" spacing="loose">
     <Text role="deletion" size="large">
       {!loading && formatCurrency(originalPrice)}
     </Text>
     <Text emphasized size="large" appearance="critical">
       {' '}
       {!loading && formatCurrency(discountedPrice)}
     </Text>
   </TextContainer>
 );
}

function ProductDescription({textLines}) {
 return (
   <BlockStack spacing="xtight">
     {textLines?.map((text, index) => (
       <TextBlock key={index} subdued>
         {text}
       </TextBlock>
     ))}
   </BlockStack>
 );
}

function MoneyLine({label, amount, loading = false}) {
 return (
   <Tiles>
     <TextBlock size="small">{label}</TextBlock>
     <TextContainer alignment="trailing">
       <TextBlock emphasized size="small">
         {loading ? '-' : formatCurrency(amount)}
       </TextBlock>
     </TextContainer>
   </Tiles>
 );
}

function MoneySummary({label, amount}) {
 return (
   <Tiles>
     <TextBlock size="medium" emphasized>
       {label}
     </TextBlock>
     <TextContainer alignment="trailing">
       <TextBlock emphasized size="medium">
         {formatCurrency(amount)}
       </TextBlock>
     </TextContainer>
   </Tiles>
 );
}

function formatCurrency(amount) {
 if (!amount || parseInt(amount, 10) === 0) {
   return 'Free';
 }
 return `$${amount}`;
}
