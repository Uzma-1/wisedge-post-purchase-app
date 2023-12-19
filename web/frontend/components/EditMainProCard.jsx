import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { Link } from "react-router-dom";
import MainEditProduct from "./MainEditProduct";
import { useDispatch, useSelector } from "react-redux";
import { EditMainUpsellReducer } from '../redux/reducer/EditMainUpsellReducer';
import { EditMainProModal } from "../redux/action/EditMainProModal";
import { DeleteMainEditReducer } from "../redux/reducer/DeleteMainEditReducer";
import Trigger from '../assets/images/trigger.png';
import { useAuthenticatedFetch } from "../hooks";

const EditMainProCard = ({ editMainCard, getCardData }) => {
    const [open, setOpen] = useState(false);
    const openShow = () => setOpen(true);
    const openClose = () => setOpen(false);
    const [data, setData] = useState();
    const [mainData, setMainData] = useState();
    const editMainUpsellData = useSelector((state) => state.EditMainUpsellReducer);
    const cardData = editMainUpsellData?.editMainUpsellData;
    const dispatch = useDispatch();
    const [getData, setGetData] = useState('');
    const fetch = useAuthenticatedFetch();

    // Main Offer
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //   get Products
    async function getProducts(){
        const response = await fetch("/api/graphql");
        const data = await response.json();
        setGetData(data);
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        mainCardData();
    }, [mainCardData]);


    function showProductData() {
        setToggleData(false);
        handleShow();
        dispatch(EditMainProModal(getData));
        openClose();
    }

    function mainCardData(){
        setData(getCardData);
        const products = data?.products;
        const main_arr = data?.funnel_details;

        if(products != undefined){
            const main_id = main_arr?.main;
            const main_pro = products[main_id];
    
            setMainData(main_pro);
        }
   
    }  

    

    function handleData() {
        setOpen(!open);
    }

    

    

    // Delete Offer
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);

    const deleteMainEditData = useSelector((state) => state.DeleteMainEditReducer);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteMainEditData);
        openClose();
    }

    

    return (
        <>
            <div className="upsell_single main_step">
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
                        <div dataid={data?.funnel_details?.main} className="img_tit_right">
                            <img src={mainData?.image} alt="Trigger" />
                            <div className="prod_name_date">
                                <h3 className="prod_title">{mainData?.title}</h3>
                                <p className="prod_price d-none">{mainData?.price}</p>
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
                            <MainEditProduct show={show} onHide={handleClose} getMainData={mainData} />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditMainProCard;
