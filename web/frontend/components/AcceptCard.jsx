import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { useSelector } from "react-redux";
import { AcceptUpsell } from "../redux/reducer/AcceptUpsell";
import { Link } from "react-router-dom";
import AcceptModal from "./AcceptModal";
import {AcceptOfferAction}  from '../redux/action/AcceptOfferAction';
import { useDispatch } from "react-redux";
import { DeleteAcceptReducer } from '../redux/reducer/DeleteAcceptReducer';
import Trigger from '../assets/images/trigger.png';
import { useAuthenticatedFetch } from "../hooks";


const AcceptCard = (props) => {

    const [open, setOpen] = useState(false);
    const openShow = () => setOpen(true);
    const openClose = () => setOpen(false);
    const fetch = useAuthenticatedFetch();
    const [data, setData] = useState();

    function handleData() {
        setOpen(!open);
    }


    //   get Products
    let isMounted = true;
    async function getProducts(){
        const response = await fetch("/api/graphql");
        const data = await response.json();
        setData(data);
        if (isMounted) {
            setData(data); // Only update state if the component is still mounted
        }
    }

    useEffect(() => {
        getProducts();
        return () => {
            isMounted = false; // Set the flag to false when the component is unmounted
        };
    }, []);

    // AcceptModal

    function showAcceptData(){
        setToggleData(false);
        acceptShowData();
        dispatch(AcceptOfferAction(data));
        openClose();
    }

    // Accept Offer
    const dispatch = useDispatch();
    const [acceptOffer, setAcceptOffer] = useState(false);
    const acceptShow = () => setAcceptOffer(true);
    const acceptHide = () => setAcceptOffer(false);
    const acceptShowData = () => setAcceptOffer(true);
    const [showAccept, setShowAccept] = useState(false);
    const acceptHandleChange = () => setShowAccept(true);

    const upsellData = useSelector((state) => state.AcceptUpsell);
    console.log(upsellData, "Accept Card");

    // Delete Offer

    const deleteAcceptData = useSelector((state) => state.DeleteAcceptReducer);
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteAcceptData);
        openClose();
    }

    return(
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
                        upsellData?.upsellData && upsellData?.upsellData.map((data, i) =>{
                            return(
                                <div className="img_tit_right" key={i} dataid={data?.id}>
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
                                    <Link onClick={showAcceptData}>Edit</Link>
                                    <Link onClick={deleteProductdata}>Delete</Link>
                                </div>
                                :
                                ""
                            }
                            <AcceptModal showAccpet={acceptOffer} closeAccept={acceptHide} showacceptdata={acceptHandleChange}/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default AcceptCard;