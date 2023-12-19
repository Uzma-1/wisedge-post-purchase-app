import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditDeclineUpsellReducer } from '../redux/reducer/EditDeclineUpsellReducer';
import DeclineEditModal from "./DeclineEditModal";
import { EditDeclineProModal } from "../redux/action/EditDeclineOffer";
import { useAuthenticatedFetch } from "../hooks";
import { DeleteDeclineEditReducer } from '../redux/reducer/DeleteDeclineEditReducer';
import Trigger from '../assets/images/trigger.png';

const EditDeclineProCard = ({ getDeclineCardData }) => {
    const [data, setData] = useState([]);
    const [declineData, setDeclineData] = useState();
    const editDeclineUpsellData = useSelector((state) => state.EditDeclineUpsellReducer);
    const cardData = editDeclineUpsellData?.editDeclineUpsellData;
    const dispatch = useDispatch();
    const [getData, setGetData] = useState('');
    const fetch = useAuthenticatedFetch();
    const [open, setOpen] = useState(false);
    const openShow = () => setOpen(true);
    const openClose = () => setOpen(false);

    //   get Products
    async function getProducts(){
        const response = await fetch("/api/graphql");
        const productData = await response.json();
        setGetData(productData);
    }

    function declineCardData(){
        setData(getDeclineCardData);
        const products = data?.products;
        const decline_arr = data?.funnel_details;

        if(products != undefined){
            const decline_id = decline_arr?.decline;
            const decline_pro = products[decline_id];
    
            setDeclineData(decline_pro);
            // console.log(products, "decline_arr??"); 
        }
   
    }


    useEffect(() => {
        getProducts(); 
    }, []);

    useEffect(() => {
        
      declineCardData();
    }, [declineCardData]);

    

    function handleData() {
        setOpen(!open);
    }

    // Edit Decline Card
    const [showEditDecline, setShowEditDecline] = useState(false);
    const handleCloseDecline = () => setShowEditDecline(false);
    const handleShowDecline = () => setShowEditDecline(true);

    function showProductData() {
        setToggleData(false);
        handleShowDecline(false);
        dispatch(EditDeclineProModal(getData));
        openClose();
    }

    // Delete Offer
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);

    const deleteDeclineEditData = useSelector((state) => state.DeleteDeclineEditReducer);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteDeclineEditData);
        openClose();
    }

    return (
        <>
            <div className="upsell_single">
                <h4 className="mt_tit">Upsell 1 (Single)</h4>

                <div className="upsell_single_iner">
                    {
                        toggleData ?
                        <div dataid="" className="img_tit_right">
                            <img src={Trigger} alt="Trigger" />
                            <div className="prod_name_date">
                                <h3 className="prod_title">Product Title</h3>
                                <p className="prod_price d-none">Product Price</p>
                            </div>
                        </div>
                            :
                        cardData && cardData == '' ?
                        <div dataid={data?.funnel_details?.decline} className="img_tit_right">
                            <img src={declineData?.image} alt="Trigger" />
                            <div className="prod_name_date">
                                <h3 className="prod_title">{declineData?.title}</h3>
                                <p className="prod_price d-none">{declineData?.price}</p>
                            </div>
                        </div>
                        :
                        cardData?.map((data, i) => (
                            <div dataid={data?.id} className="img_tit_right" key={i}>
                                <img src={data?.imageSrc} alt="Trigger" />
                                <div className="prod_name_date">
                                    <h3 className="prod_title">{data?.title}</h3>
                                    <p className="prod_price d-none">{data?.price}</p>
                                </div>
                            </div>
                        ))
                    }
                    <div className="details_left">
                        <div className="prod_name_date">
                            <h5>{data?.funnel_details?.funl_name}</h5>
                        </div>
                        <div className="status_btn">
                            <h5>Status</h5>
                            <label className="toggle">
                                <input type="checkbox" defaultChecked/>
                                <span className="slider"></span>
                                <span className="labels" data-on="ON" data-off="OFF"></span>
                            </label>
                        </div>
                        <div className="action_btns">
                            <img onClick={handleData} src={ThreeDots} alt="ThreeDots" />
                            {open && (
                                <div className="dots-wrap">
                                    <Link onClick={showProductData}>Edit</Link>
                                    <Link onClick={deleteProductdata}>Delete</Link>
                                </div>
                            )}
                            <DeclineEditModal showEditDecline={showEditDecline} hideEditDecline ={handleCloseDecline} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditDeclineProCard;
