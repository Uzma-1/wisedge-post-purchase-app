import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { useSelector } from "react-redux";
import { GetUpsellReducer } from "../redux/reducer/GetUpsellReducer";
import { ProductAction } from "../redux/action/ProductAction";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import { DeleteMainReducer } from "../redux/reducer/DeleteMainReducer";
import Trigger from '../assets/images/trigger.png';
import { useAuthenticatedFetch } from "../hooks";

const ProductCard = () => {

    const [open, setOpen] = useState(false);
    const openShow = () => setOpen(true);
    const openClose = () => setOpen(false);
    const fetch = useAuthenticatedFetch();
    const [data, setData] = useState();

    function handleData() {
        setOpen(!open);
    }

    //   get Products
    async function getProducts(){
        const response = await fetch("/api/graphql");
        const data = await response.json();
        setData(data);
    }

    useEffect(() => {
        getProducts();
    }, []);

    // ProductModal

    function showProductData(){
        setToggleData(false);
        handleShow();
        dispatch(ProductAction(data));
        openClose();
    }


    // Main Offer
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showData, setShowData] = useState(false);
    const handleShowData = () => setShowData(true);

    const upsellData = useSelector((state) => state.GetUpsellReducer);
    
    
    // Delete Offer
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);

    const deleteMainData = useSelector((state) => state.DeleteMainReducer);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteMainData);
        openClose();
    }

    return(
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
                        upsellData?.upsellData && upsellData?.upsellData.map((data, i) =>{
                          return(
                                <div dataid={data?.id} className="img_tit_right" key={i}>
                                    <img src={data?.imageSrc} alt="Trigger" />
                                    <div className="prod_name_date">
                                        <h3 className="prod_title">{data?.title}</h3>
                                        <p className="prod_price d-none">{data?.price}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="details_left">
                        <div className="prod_name_date">
                            <h5>Funnel Name </h5>
                            <h4>New Funnel for Product 10 Feb</h4>
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
                            {
                                open ? 
                                <div className="dots-wrap">
                                    <Link onClick={showProductData}>Edit</Link>
                                    <Link onClick={deleteProductdata}>Delete</Link>
                                </div>
                                :
                                ""
                            }
                            <ProductModal show={show} close={handleClose} showdata={handleShowData}/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default ProductCard;