import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { TriggerReducer } from "../redux/reducer/TriggerReducer";


const TriggerModal = ({showTrigger, closeTrigger, handletriggerdata}) => {



    const triggerData = useSelector((state) => state.TriggerReducer);
    

    const handleProductClose = () => {
        closeTrigger();
    }
    const [product, setProduct] = useState([]);
    const [offer, setOffer] = useState([]);
    const handleShowProductData = () => {
        handletriggerdata();
    }

    const toggleHandler = (item) => () => {
        setProduct(() => (
            {
                id: item?.node?.legacyResourceId,
                title: item?.node?.title,
                price: item?.node?.variants?.edges[0]?.node?.price,
                imageSrc: item?.node?.images?.edges[0]?.node?.originalSrc
            }
            ));

      };


    function getShowProductList(){
        offer.push(product, setOffer);
        handleShowProductData();
        handleProductClose();
    } 

    return(
        <>


            <Modal show={showTrigger} onHide={closeTrigger}>
                <Modal.Header closeButton>
                <Modal.Title>Create Post-Purchase Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <table className="productsdiv w-100">
                    <tbody>
                            {
                            triggerData?.triggerData?.data?.products?.edges && triggerData?.triggerData?.data?.products?.edges.map((item) => {
                                const id = item?.node?.legacyResourceId || '';
                                const title = item?.node?.title || '';
                                const price = item?.node?.variants?.edges[0]?.node?.price || '';
                                const imageSrc = item?.node?.images?.edges[0]?.node?.originalSrc || '';
                                const imageAlt = item?.node?.images?.edges[0]?.node?.altText || '';
                                return (
                                <tr
                                    key={id}
                                    style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center"
                                    }}
                                >
                                    <td className="checkboxbuton">
                                    <input
                                    onChange={toggleHandler(item)}
                                    checked={setProduct[item]}
                                    style={{ margin: "20px" }}
                                    type="checkbox"
                                    value={setProduct[item]}
                                    />
                                    <label></label>
                                    </td>
                                    <td className="featureimg img" style={{ margin: "20px" }}><img src={imageSrc} alt={imageAlt} /></td>
                                    <td className="flex-grow" style={{ margin: "20px" }}>{title}</td>
                                    <td style={{ margin: "20px" }}>{price}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button id="close_btn" onClick={closeTrigger}>
                    Cancel
                </Button>
                <Button id="add_btn" type="submit" 
                onClick={() => getShowProductList()}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default TriggerModal;