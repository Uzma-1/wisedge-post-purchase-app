import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { Link } from "react-router-dom";
import MainEditProduct from "./MainEditProduct";
import { useDispatch, useSelector } from "react-redux";
import { EditAcceptUpsellReducer } from '../redux/reducer/EditAcceptUpsellReducer';
import AcceptEditModal from "./AcceptEditModal";
import { EditAcceptProModal } from "../redux/action/EditAcceptOffer";
import { useAuthenticatedFetch } from "../hooks";
import Trigger from '../assets/images/trigger.png';


const EditAcceptProCard = ({ getAcceptCardData }) => {
    const [open, setOpen] = useState(false);
    const openShow = () => setOpen(true);
    const openClose = () => setOpen(false);
    const [data, setData] = useState([]);
    const [acceptData, setAcceptData] = useState();
    const editAcceptUpsellData = useSelector((state) => state.EditAcceptUpsellReducer);
    const cardData = editAcceptUpsellData?.editAcceptUpsellData;
    const dispatch = useDispatch();
    const [getData, setGetData] = useState(null);
    const fetch = useAuthenticatedFetch();
    // console.log("Accept cardData", cardData);

    

    //   get Products
    async function getProducts() {
        const response = await fetch("/api/graphql");
        const data = await response.json();
        setGetData(data);
    }

    useEffect(() => {
        
        getProducts();
    }, []);

    useEffect(() => {
        
        acceptCardData();
    }, [acceptCardData]);


    function acceptCardData(){
        setData(getAcceptCardData);
        const products = data?.products;
        const accept_arr = data?.funnel_details;
        if(products != undefined){
            const accept_id = accept_arr?.accept;
            const accept_pro = products[accept_id];
    
            setAcceptData(accept_pro);
            // console.log(accept_pro, "accept_arr??"); 
        }
    }
    

    function handleData() {
        setOpen(!open);
    }

    function showProductData() {
        setToggleData(false);
        handleShowAccept();
        dispatch(EditAcceptProModal(getData));
        openClose();
    }

    // Edit Accept Card
    const [showEditAccept, setShowEditAccept] = useState(false);
    const handleCloseAccept = () => setShowEditAccept(false);
    const handleShowAccept = () => setShowEditAccept(true);


    // Delete Offer
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);

    const deleteAcceptEditData = useSelector((state) => state.DeleteAcceptEditReducer);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteAcceptEditData);
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
                        <div dataid={data?.funnel_details?.accept} className="img_tit_right">
                            <img src={acceptData?.image} alt="Trigger" />
                            <div className="prod_name_date">
                                <h3 className="prod_title">{acceptData?.title}</h3>
                                <p className="prod_price d-none">{acceptData?.price}</p>
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
                            {/* <h4>New Funnel for Product 10 Feb</h4> */}
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
                            <AcceptEditModal showEditAccept={showEditAccept} hideEditAccept ={handleCloseAccept} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAcceptProCard;
