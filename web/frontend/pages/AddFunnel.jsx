import React, { useEffect, useState } from "react";
import LeftArrow from '../assets/images/left-arrow.svg';
import { Link, useNavigate } from "react-router-dom";
import Trigger from '../assets/images/trigger.png';
import TriggerModal from "../components/TriggerModal";
import {TriggerAction} from '../redux/action/TriggerAction';
import { useDispatch } from "react-redux";
import ShowProductModal from "../components/ShowProductModal";
import {ShowProductAction} from '../redux/action/ShowProductAction'
import AfterPurchase from '../assets/images/after_purchase.png';
import { ProductAction } from "../redux/action/ProductAction";
import ProductModal from "../components/ProductModal";
import { Button } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import {AcceptOfferAction}  from '../redux/action/AcceptOfferAction';
import AcceptModal from "../components/AcceptModal";
import AcceptCard from "../components/AcceptCard";
import { DeclineOfferAction } from "../redux/action/DeclineOfferAction";
import DeclineModal from "../components/DeclineModal";
import DeclineCard from '../components/DeclineCard';
import { useAuthenticatedFetch } from "../hooks";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const AddFunnel = () => {

    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    // Main Offer
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showData, setShowData] = useState(false);
    const handleShowData = () => setShowData(true);
    const fetch = useAuthenticatedFetch();
    const [data, setData] = useState();

    // Trigger Product
    const [triggerProduct, setTriggerProduct] = useState(false);
    const handleTriggerClose = () => setTriggerProduct(false);
    const handleTriggerShow = () => setTriggerProduct(true);
    const [triggerProductData, settriggerProductData] = useState(false);
    const handleTriggerProductData = () => settriggerProductData(true);

    // Show Product
    const [showProduct, setShowProduct] = useState(false);
    const handleProductClose = () => setShowProduct(false);
    const handleProductShow = () => setShowProduct(true);
    const [showProductData, setShowProductData] = useState(false);
    const handleShowProductData = () => setShowProductData(true);

    // Accept Offer
    const [acceptOffer, setAcceptOffer] = useState(false);
    const acceptShow = () => setAcceptOffer(true);
    const acceptHide = () => setAcceptOffer(false);
    const acceptShowData = () => setAcceptOffer(true);
    const [showAccept, setShowAccept] = useState(false);
    const acceptHandleChange = () => setShowAccept(true);

    // Decline Offer
    const [declineOffer, setDeclineOffer] = useState(false);
    const declineShow = () => setDeclineOffer(true);
    const declineHide = () => setDeclineOffer(false);
    const declineShowData = () => setDeclineOffer(true);
    const [showDecline, setShowDecline] = useState(false);
    const declineHandleChange = () => setShowDecline(true);

    // Publish
    const [publish, setPublish] = useState(false);
    
    // Save Button
    const [isLoading, setIsLoading] = useState(false);

    // Validate 
    const [mainProductSelected, setMainProductSelected] = useState(false);
    const [acceptProductSelected, setAcceptProductSelected] = useState(false);
    const [showError, setShowError] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    // Ajaxcart button toggle
    const [selectedDiv, setSelectedDiv] = useState(null);

    const handleDivClick = (index) => {
        setSelectedDiv(index);
      };


    //   get Products
    async function getProducts(){
        const response = await fetch("/api/graphql");
        const data = await response.json();
        setData(data);
    }

    useEffect(() => {
        getProducts();
    }, []);


    // Product Handle
    async function productHandle(){
        handleShow();
        dispatch(ProductAction(data));
        // Set the main product selected state
        setMainProductSelected(true);
    }

    // Trigger Function
    function triggerDataHandler() {
        handleTriggerShow();
        dispatch(TriggerAction(data));
    }

    // ShowProduct Function
    function showProductHandler() {
        handleProductShow();
        dispatch(ShowProductAction(data));
    }

    // Accept Function
    function acceptDataHandle(){
        acceptShowData();
        dispatch(AcceptOfferAction(data));
        // Set the accept product selected state
        setAcceptProductSelected(true);
    }

    // Decline Function
    function declineDataHandle(){
        declineShowData();
        dispatch(DeclineOfferAction(data));
    }

    function dataPublish(){
        setPublish((prevState) => !prevState); // Using the previous state to ensure correct update
    }
    
   function dataHandler(){

    if (!mainProductSelected || !acceptProductSelected) {
        // Show an error Snackbar
        setSnackbarMessage('Please select both main and accept products');
        setSnackbarOpen(true);

        // Stop the loader
        setIsLoading(false);
        return; // Don't proceed with saving
    }

    if (!title) {
        // Display a toast message when the funnel title is blank
        setSnackbarMessage('Funnel title cannot be blank');
        setSnackbarOpen(true);
        return;
    }

    setIsLoading(true); // Show the loader

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
        var accept_status = accept_status_value ? (accept_status_value.checked ? "on" : "off") : "off";

        var decline_status_value = document.querySelector('.if_customer_declines_offer .details_left .status_btn input');
        var decline_status = decline_status_value ? (decline_status_value.checked ? "on" : "off") : "off";
        
        // Product Table Data
        var main_pro_table_id = main_pro_id;
        var accept_pro_table_id = accept_pro_id;
        var decline_pro_table_id = decline_id;
        var main_product_img = document.querySelectorAll('.upsell_single.main_step .img_tit_right img');
        var pro_img_final = '';
            main_product_img.forEach(function (main_pro_img) {
                console.log("ee");
                pro_img_final = main_pro_img.getAttribute('src');
                console.log("ee", pro_img_final);
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
        var main_pro_title = main_product_title ? main_product_title.textContent : "";

        var accept_product_title = document.querySelector('.if_customer_accepts_offer .img_tit_right .prod_title');
        var accept_pro_title = accept_product_title ? accept_product_title.textContent : "";

        var decline_product_title = document.querySelector('.if_customer_declines_offer .img_tit_right .prod_title');
        var delcine_pro_title = decline_product_title ? decline_product_title.textContent : "";


        var main_product_price = document.querySelector('.upsell_single.main_step .img_tit_right .prod_price');
        var main_pro_price = main_product_price ? main_product_price.textContent : "";

        var accpet_product_price = document.querySelector('.if_customer_accepts_offer .img_tit_right .prod_price');
        var accept_pro_price = accpet_product_price ? accpet_product_price.textContent : "";

        var decline_product_price = document.querySelector('.if_customer_declines_offer .img_tit_right .prod_price');
        var decline_pro_price = decline_product_price ? decline_product_price.textContent : "";

        var funnel_status_value = document.querySelector('.condition_item .publish-funnel.published');
        var funnel_status = funnel_status_value ? "published" : "unpublished";
        console.log('funnel_status', funnel_status);

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
        console.log(product_data, "product_data");
        var product_id = [
            main_pro_table_id,
            accept_pro_table_id,
            decline_pro_table_id
        ]
        console.log('product_id??', product_id);

            var send_data = {
                funnel_name:funnel_value,
                funnel_status:funnel_status,
                funnel_trigger:trigger_value,
                main_product_id:main_pro_id,
                accept_product_id:accept_pro_id,
                decline_product_id:decline_pro_id,
                accept_status:accept_status,
                decline_status:decline_status,
                // product_id: main_pro_table_id,
                // product_id: accept_pro_table_id,
                // product_id: decline_pro_table_id,
                product_id: product_id,
                product_data: product_data,
            }   


    fetch('/api/update-funnel', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(send_data)
    })
    .then((response) => {
        if (!response.ok) {
        throw new Error('Error: ' + response.status);
        }
        return response.json();
    })
    .then((responseData) => {
        console.log(responseData);
    })
    .catch((error) => {
        console.error('Error sending data:', error);


    // Hide the loader if an error occurs
    setIsLoading(false);

});

setTimeout(() => {
    navigate("/goldenUpsell");
}, 2000);



}

    return(
        <>
        {
            <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000} // Adjust the duration as needed
            onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={handleCloseSnackbar}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        }
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
                        <input type="text" placeholder="New Funnel 2" value={title} onChange={(e) => setTitle(e.target.value)} /> <span className="unpublished">Unpublished</span>
                    </div>
                    <div className={`publish-funnel ${publish === true ? 'published' : 'unpublished'}`} onClick={dataPublish}>
                    <button id="save-funnel" className="d-inline-flex mx-2" onClick={dataHandler}>
                    {isLoading ? "Saving..." : "Save Funnel"}
                    </button>
                        <button id="pub_fun">
                            {publish === false ? 'Publish Funnel' : 'Unpublish Funnel'}
                        </button>
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
                            <button id="slct_btn" onClick={triggerDataHandler} >Select Triggers</button>
                            <TriggerModal showTrigger={triggerProduct} closeTrigger={handleTriggerClose} handletriggerdata={handleTriggerProductData}/>
                        </div>
                    </div>
                </div> */}
                {/* <form action="">
                    <div className="container_triggers shop_ajax">
                        <div className="ajax_iner">
                            <div className={`ajaxcart_btns ${selectedDiv === 0 ? 'active' : ''}`}
                            onClick={() => handleDivClick(0)}>
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
                            <div className={`sec_itm ajaxcart_btns ${selectedDiv === 1 ? 'active' : ''}`}
                            onClick={() => handleDivClick(1)}>
                                <div className="txt_itm">
                                    <span className="field">
                                        <span className="field_item">
                                            <input type="radio" id="cart_ajx_btn" className="ajax_input"
                                                name="ajax_cart" value="Product Page" defaultChecked />
                                            <label htmlFor="cart_ajx_btn">Product Page</label>
                                            <p>Add to Cart button is clicked. 
                                                <Link to="#">Learn More </Link>
                                            </p>
                                        </span>
                                    </span>
                                </div>

                            </div>
                                {/* <ShowProductModal show={showProduct} close={handleProductClose} showproductdata={handleShowProductData} /> */}

                            {/* <button id="add_upsell" onClick={(e) => e.preventDefault()}>Add Upsell Offer +</button> */}
                        {/* </div>
                    </div>
                </form>  */}
                <div className="after_purchase mt-5">
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
                            <Button id="slct_btn" onClick={productHandle}>Add Upsell Offer +</Button>
                            <ProductModal show={show} close={handleClose} showdata={handleShowData}/>
                        </div>
                    </div>
                </div>

                {
                    showData ? 
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

                            <ProductCard />
                                <div className="conditions_works progres">
                                    <div className="progress__item if_customer_accepts_offer">
                                    <div className="ofer_title">
                                        <h2>If Customer <span>Accepts Offer</span></h2>
                                        <Button id="add_upsell" onClick={acceptDataHandle}>Add Upsell Offer +</Button>
                                        <AcceptModal showAccpet={acceptOffer} closeAccept={acceptHide} showacceptdata={acceptHandleChange}/>
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

                                    {
                                    showAccept ? 
                                    <AcceptCard />
                                    :
                                    ""
                                    }

                                    </div>
                                    <div className="progress__item if_customer_declines_offer">
                                    <div className="ofer_title">
                                    <h2>If Customer <span>declines Offer</span></h2>
                                    <Button id="remove_upsell" onClick={declineDataHandle}>Add Upsell Offer +</Button>
                                    <DeclineModal showDecline={declineOffer} closeDecline={declineHide} showdeclinedata={declineHandleChange}/>
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
                                    {
                                    showDecline ? 
                                    <DeclineCard />
                                    :
                                    ""
                                    }

                                    </div>
                                </div>


                        </div>
                    </div>
                    :
                    ""
                    }
                </div>
                <button id="save-funnel" className="d-inline-flex mt-5" onClick={dataHandler}>
                {isLoading ? "Saving..." : "Save Funnel"}
                </button>
            </div>
        </>
    )
}

export default AddFunnel;
