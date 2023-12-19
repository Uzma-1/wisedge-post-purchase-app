import React, { useEffect, useState } from "react";
import ThreeDots from '../assets/images/three-dots.svg';
import { useSelector } from "react-redux";
import { DeclineUpsell } from "../redux/reducer/DeclineUpsell";
import DeclineModal from "../components/DeclineModal";
import { DeclineOfferAction } from "../redux/action/DeclineOfferAction";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteDeclineReducer } from '../redux/reducer/DeleteDeclineReducer';
import Trigger from '../assets/images/trigger.png';
import { useAuthenticatedFetch } from "../hooks";


const DeclineCard = (props) => {

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
        console.log('data??', data);
    }

    useEffect(() => {
        getProducts();
    }, []);

    // ProductModal

    function showDeclineData(){
        setToggleData(false);
        setDeclineOffer(true);
        dispatch(DeclineOfferAction(data));
        openClose();
    }

    // Decline Offer
    const dispatch = useDispatch();
    const [declineOffer, setDeclineOffer] = useState(false);
    const declineShow = () => setDeclineOffer(true);
    const declineHide = () => setDeclineOffer(false);
    const declineShowData = () => setDeclineOffer(true);
    const [showDecline, setShowDecline] = useState(false);
    const declineHandleChange = () => setShowDecline(true);

    const declineUpsellData = useSelector((state) => state.DeclineUpsell);
    // console.log(declineUpsellData, "Accept Card");


    // Delete Offer

    const deleteDeclineData = useSelector((state) => state.DeleteDeclineReducer);
    const [deleteData, setDeleteData] = useState();
    const [toggleData, setToggleData] = useState(false);
    
    function deleteProductdata(){
        setToggleData(true);
        setDeleteData(deleteDeclineData);
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
                        declineUpsellData?.declineUpsellData && declineUpsellData?.declineUpsellData.map((data, i) =>{
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
                                    <Link onClick={showDeclineData}>Edit</Link>
                                    <Link onClick={deleteProductdata}>Delete</Link>
                                </div>
                                :
                                ""
                            }
                            <DeclineModal showDecline={declineOffer} closeDecline={declineHide} showdeclinedata={declineHandleChange}/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default DeclineCard;