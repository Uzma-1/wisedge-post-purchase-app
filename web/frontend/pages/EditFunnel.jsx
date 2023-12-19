import React, { useEffect, useState } from "react";
import LeftArrow from '../assets/images/left-arrow.svg';
import { Link, useNavigate, useParams } from "react-router-dom";
import Trigger from '../assets/images/trigger.png';
import AfterPurchase from '../assets/images/after_purchase.png';
import { Button } from "react-bootstrap";
import MainEditProduct from "../components/MainEditProduct";
import EditMainProCard from "../components/EditMainProCard";
import { useDispatch } from "react-redux";
import { EditMainProModal } from "../redux/action/EditMainProModal";
import AcceptEditModal from "../components/AcceptEditModal";
import { EditAcceptProModal } from "../redux/action/EditAcceptOffer";
import EditAcceptProCard from "../components/EditAcceptProCard";
import DeclineEditModal from "../components/DeclineEditModal";
import { EditDeclineProModal } from "../redux/action/EditDeclineOffer";
import EditDeclineProCard from '../components/EditDeclineProCard';
import { useAuthenticatedFetch } from "../hooks";
import Loader from "../components/Loader";

const EditFunnel = () => {
    const [title, setTitle] = useState('');
    const [editFunnel, setEditFunnel] = useState([]);
    const [funnelTrigger, setFunneltrigger] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetch = useAuthenticatedFetch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Edit Accept Card
    const [showEditAccept, setShowEditAccept] = useState(false);
    const handleCloseAccept = () => setShowEditAccept(false);
    const handleShowAccept = () => setShowEditAccept(true);


    // Edit Decline Card
    const [showEditDecline, setShowEditDecline] = useState(false);
    const handleCloseDecline = () => setShowEditDecline(false);
    const handleShowDecline = () => setShowEditDecline(true);

    const params = useParams();

    // Main Edit Product Data card
    const [mainData, setMainData] = useState([]);

    // Publish
    const [publish, setPublish] = useState(editFunnel?.funnel_details?.funl_status === "published");

    // Update Button
    const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
    getData();
    const sendMainData = () => {
        setMainData(editFunnel);
    };
    
    sendMainData();
    getProducts();
}, [params]);


// Get Edit Products
async function getProducts(){
    const response = await fetch("/api/graphql");
    const data = await response.json();
    setData(data);
}

async function getData(){
    setLoading(true);
    try {
        const response = await fetch(`/api/editFunnel/${params.Id}`);
        if (!response.ok) {
        //   throw new Error('Error: ' + response.status);
        }
    
        const result = await response.json();
        var data = result['data'];
        var accept_pro = data[0]['accept_product_id'];
        var decline_pro = data[0]['decline_product_id'];
        var main_pro = data[0]['main_product_id'];
        var funnel_title = data[0]['funnel_name'];
        var funnel_status = data[0]['funnel_status'];
        setPublish(funnel_status);
        var funnel_trigger = data[0]['funnel_trigger'];

        var products = [];
        var funnel_details = {"accept":accept_pro,"decline":decline_pro,"main":main_pro,"funl_name": funnel_title, "funl_status": funnel_status, "funl_trigger": funnel_trigger};

            for(var i=0;i<data.length;i++){
                var pro = data[i];
                var pro_title = pro['title'];
                var pro_price = pro['price'];
                var pro_image = pro['image'];
                products[data[i]['product_id']]={"title":pro_title,"price":pro_price,"image":pro_image};
            }
            var funel_main_id = funnel_details['main'];
            var pro_title = products[funel_main_id]['title'];

            var final_data = {
                funnel_details:funnel_details,
                products:products
            };
        setEditFunnel(final_data);  
        setTitle(final_data?.funnel_details?.funl_name);
        setFunneltrigger(final_data?.funnel_details?.funl_trigger);
    }
     catch (error) {
    console.error('Error fetching data:', error);
  }
  setLoading(false);
}

// Add a function to send the updated status to the server
function dataPublish() {
    // Toggle the status
    const newPublishStatus = publish === "published" ? "unpublished" : "published";
    console.log('Toggling status. New status:', newPublishStatus);

    // Send the updated status to the server
    fetch(`/api/update-funnel-status/${params.Id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ funnel_status: newPublishStatus }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
        // Update the status in the component state after a successful request
        setPublish(newPublishStatus);
        console.log('Status updated successfully. New status:', newPublishStatus);
    })
    .catch((error) => {
        console.error('Error updating funnel status:', error);
        // You may choose to show an error message to the user here
    });
}








const handleSubmit = async (e) => {  
    setIsLoading(true); // Show the loader
    e.preventDefault();
    
    // funnel Data
    var funnel_name = document.querySelector('.tit_itm input');
    var funnel_value = funnel_name.value;
    var ajaxcart_btns =  document.querySelector('.ajax_iner .ajaxcart_btns.active .ajax_input');
    var trigger_value = ajaxcart_btns ? ajaxcart_btns.value : "Shopping Cart / AJAX Cart";
    var main_product = document.querySelectorAll('.upsell_single.main_step .img_tit_right');
    var data_id_final = '';
        main_product.forEach(function (main_pro) {
            data_id_final = main_pro.getAttribute('dataid')
        });
    var main_pro_id = data_id_final;
    var accept_product = document.querySelectorAll('.if_customer_accepts_offer .img_tit_right');
    var accept_id = '';
        accept_product.forEach(function (accept_pro) {
            accept_id = accept_pro.getAttribute('dataid')
        });
    var accept_pro_id = accept_id;


    var decline_product = document.querySelectorAll('.if_customer_declines_offer .img_tit_right');
    var decline_id = '';
        decline_product.forEach(function (decline_pro) {
            decline_id = decline_pro.getAttribute('dataid');
        });
    var decline_pro_id = decline_id;
    
    var accept_status_value = document.querySelector('.if_customer_accepts_offer .details_left .status_btn input');
    var accept_status = accept_status_value.checked ? "on" : "off";

    var decline_status_value = document.querySelector('.if_customer_declines_offer .details_left .status_btn input');
    var decline_status = decline_status_value.checked ? "on" : "off";
    
    // Product Table Data
    var main_pro_table_id = main_pro_id;
    var accept_pro_table_id = accept_pro_id;
    var decline_pro_table_id = decline_id;
    var main_product_img = document.querySelectorAll('.upsell_single.main_step .img_tit_right img');
    var pro_img_final = '';
        main_product_img.forEach(function (main_pro_img) {
            pro_img_final = main_pro_img.getAttribute('src');
        });
    var pro_main_img = pro_img_final;

    var accept_product_img = document.querySelectorAll('.if_customer_accepts_offer .img_tit_right img');
    var accept_img = '';
    accept_product_img.forEach(function (accept_pro_img) {
            accept_img = accept_pro_img.getAttribute('src')
        });
    var accept_pro_image = accept_img;
    
    var decline_product_img = document.querySelectorAll('.if_customer_declines_offer .img_tit_right img');
    var decline_img = '';
    decline_product_img.forEach(function (decline_pro_img) {
        decline_img = decline_pro_img.getAttribute('src')
        });
    var decline_pro_image = decline_img;

    var main_product_title = document.querySelector('.upsell_single.main_step .img_tit_right .prod_title');
    var main_pro_title = main_product_title.textContent;

    var accept_product_title = document.querySelector('.if_customer_accepts_offer .img_tit_right .prod_title');
    var accept_pro_title = accept_product_title.textContent;

    var delcine_product_title = document.querySelector('.if_customer_declines_offer .img_tit_right .prod_title');
    var delcine_pro_title = delcine_product_title.textContent;

    var main_product_price = document.querySelector('.upsell_single.main_step .img_tit_right .prod_price');
    var main_pro_price = main_product_price.textContent;

    var accpet_product_price = document.querySelector('.if_customer_accepts_offer .img_tit_right .prod_price');
    var accept_pro_price = accpet_product_price.textContent;

    var decline_product_price = document.querySelector('.if_customer_declines_offer .img_tit_right .prod_price');
    var decline_pro_price = decline_product_price.textContent;

    var funnel_status_value = document.querySelector('.condition_item .publish-funnel.published');
    var funnel_status = funnel_status_value ? "published" : "unpublished";

    var product_data = {
        main_pro_table: {
            product_id: main_pro_table_id,
            image: pro_main_img,
            title: main_pro_title,
            price: main_pro_price
        },
        accept_pro_table: {
            product_id: accept_pro_table_id,
            image: accept_pro_image,
            title: accept_pro_title,
            price: accept_pro_price
        },
        decline_pro_table: {
            product_id: decline_pro_table_id,
            image: decline_pro_image,
            title: delcine_pro_title,
            price: decline_pro_price
        }
    }

        var send_data = {
            funnel_name:funnel_value,
            funnel_status:funnel_status,
            funnel_trigger:trigger_value,
            main_product_id:main_pro_id,
            accept_product_id:accept_pro_id,
            decline_product_id:decline_pro_id,
            accept_status:accept_status,
            decline_status:decline_status,
            product_id: main_pro_table_id,
            product_id: accept_pro_table_id,
            product_id: decline_pro_table_id,
            product_data: product_data,
        }   


try {
    const response = await fetch(`/api/editFunnel/${params?.Id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(send_data),
    });

    if (!response.ok) {
        throw new Error('Error: ' + response.status);
    }

    const responseData = await response.json();

    // Hide the loader if an error occurs
    setIsLoading(false);

    setTitle('');

    setTimeout(() => {
        navigate("/goldenUpsell");
    }, 2000);

    } catch (error) {
    console.error('Error sending data:', error);
    }
}

function funnelTriggerHandle(e) {
    setFunneltrigger(e.target.value)
}

function editMainProduct() {
    handleShow();
    dispatch(EditMainProModal(data));
}

function editAcceptProduct() {
    handleShowAccept();
    dispatch(EditAcceptProModal(data));
}

function editDeclineProduct(){
    handleShowDecline();
    dispatch(EditDeclineProModal(data));
}




    return(
        <>
            <div className="funnel-trigger-condition">
                <div className="back_button">
                    <Link to="/goldenUpsell" className="trigger-condition" id="trigger-condition_back">
                        <img src={LeftArrow} alt="LeftArrow" />
                        <h2>Back to home</h2>
                    </Link>
                </div>
                    <div className="condition_item">
                    <div className="my_item_title_main">
                    <div className="tit_itm">
                        <input type="text" placeholder="New Funnel 2" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <span className="unpublished">
                        {
                            editFunnel?.funnel_details?.funl_status === "published" ?
                            "published" :
                            "Unpublish"
                        }
                        </span>
                    </div>
                    <div className="btn-wrap d-flex">
                        <button id="save-funnel" className="d-inline-flex mx-3" onClick={handleSubmit}>
                        {isLoading ? "Update..." : "Update Funnel"}
                        </button>
                        <div className={`publish-funnel ${publish === 'published' ? 'published' : 'unpublished'}`} onClick={dataPublish}>
                            <button id="pub_fun">
                            {publish === 'published' ? "Unpublish Funnel" : "Publish Funnel"}
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className="container_triggers">
                    <div className="con_inr">
                        <div className="lft_syd">
                            <img src={Trigger} alt="Trigger" />
                            <div className="txt_itm">
                                <h3>Triggers</h3>
                                <p>Select conditions you want to trigger the funnel. 
                                    <Link to="#">Learn More</Link>
                                </p>
                            </div>
                        </div>
                        <div className="ryt_syd">
                            <button id="slct_btn" >Select Triggers</button>

                        </div>
                    </div>
                </div>
                <form action="">
                    <div className="container_triggers shop_ajax">
                        <div className="ajax_iner">
                            <div className={`ajaxcart_btns ${funnelTrigger === "Shopping Cart /  AJAX Cart" ? "active" : ""}`} onClick={(e) => funnelTriggerHandle(e)}>
                                <div className="txt_itm">
                                    <span className="field">
                                        <span className="field_item">
                                            <input type="radio" id="ajax_cart" className="ajax_input"
                                                name="ajax_cart" value="Shopping Cart /  AJAX Cart" defaultChecked />
                                            <label htmlFor="ajax_cart">Shopping Cart / AJAX Cart</label>
                                            <p>Checkout button is clicked. 
                                                <Link to="#">Learn More </Link>
                                            </p>
                                        </span>
                                    </span>
                                </div>

                            </div>
                            <div className={`sec_itm ajaxcart_btns ${funnelTrigger === "Product Page" ? "active" : ""}`} onClick={(e) => funnelTriggerHandle(e)}>
                                <div className="txt_itm">
                                    <span className="field">
                                        <span className="field_item">
                                            <input type="radio" id="cart_ajx_btn" className="ajax_input"
                                                name="ajax_cart" value="Product Page" defaultChecked/>
                                            <label htmlFor="cart_ajx_btn">Product Page</label>
                                            <p>Add to Cart button is clicked. 
                                                <Link to="#">Learn More </Link>
                                            </p>
                                        </span>
                                    </span>
                                </div>

                            </div>

                            <button id="add_upsell" onClick={(e) => e.preventDefault()}>Add Upsell Offer +</button>
                        </div>
                    </div>
                </form> */}
                <div className="after_purchase">
                    <h1>Purchase Completed</h1>
                    <div className="doted_border"></div>
                </div>

                <div className="container_triggers">
                    <div className="con_inr">
                        <div className="lft_syd">
                            <img src={AfterPurchase} alt="after_purchase" />
                            <div className="txt_itm">
                                <h3>Post Purchase</h3>
                                <p>Customer completes Checkout.
                                    <Link to="#">Learn More</Link>
                                </p>
                            </div>
                        </div>
                        <div className="ryt_syd">
                            <Button id="slct_btn" onClick={editMainProduct}>Add Upsell Offer +</Button>
                            <MainEditProduct show={show} onHide={handleClose} getMainData={mainData} />
                        </div>
                    </div>
                </div>

                    <div className="after_postpurchase" showdata="handleShowData">
                    <div className="after_postpurchase_iner">
                        <div className="main_title_section">
                            <h3>Post-Purchase Upsell Offer #1</h3>
                            <label className="selectdiv">
                                <select className="prod_select">
                                    <option>Active</option>
                                    <option>Deactive</option>
                                </select>
                            </label>
                        </div>

                            <EditMainProCard editMainCard={mainData} getCardData={editFunnel} />
                                <div className="conditions_works progres">
                                    <div className="progress__item if_customer_accepts_offer">
                                    <div className="ofer_title">
                                        <h2>If Customer <span>Accepts Offer</span></h2>
                                        <Button id="add_upsell" onClick={editAcceptProduct}>Add Upsell Offer +</Button>
                                        <AcceptEditModal showEditAccept={showEditAccept} hideEditAccept ={handleCloseAccept} />
                                    </div>
                                    <div className="main_title_section">
                                        <h3>Post-Purchase Upsell Offer #1</h3>
                                        <label className="selectdiv">
                                            <select className="prod_select">
                                                <option>Active</option>
                                                <option>Deactive</option>
                                            </select>
                                        </label>
                                    </div>

                                    <EditAcceptProCard getAcceptCardData={editFunnel} />

                                    </div>
                                    <div className="progress__item if_customer_declines_offer">
                                    <div className="ofer_title">
                                    <h2>If Customer <span>declines Offer</span></h2>
                                    <Button id="remove_upsell" onClick={editDeclineProduct} >Add Upsell Offer +</Button>
                                    <DeclineEditModal showEditDecline={showEditDecline} hideEditDecline ={handleCloseDecline} />
                                    </div>
                                    <div className="main_title_section">
                                        <h3>Post-Purchase Upsell Offer #1</h3>
                                        <label className="selectdiv">
                                            <select className="prod_select">
                                                <option>Active</option>
                                                <option>Deactive</option>
                                            </select>
                                        </label>
                                    </div>

                                    <EditDeclineProCard getDeclineCardData={editFunnel} />

                                    </div>
                                </div>


                        </div>
                    </div>
                </div>
                <button id="save-funnel" className="d-inline-flex mt-5" onClick={handleSubmit}>
                {isLoading ? "Update..." : "Update Funnel"}
                </button>
            </div>

        </>
    )
}

export default EditFunnel;
