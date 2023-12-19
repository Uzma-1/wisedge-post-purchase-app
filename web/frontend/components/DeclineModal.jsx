import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { DeclineOfferReducer } from "../redux/reducer/DeclineOfferReducer";
import { DeclineUpsellAction } from '../redux/action/DeclineUpsellAction';


const DeclineModal = ({showDecline, closeDecline, showdeclinedata}) => {

    const declineData = useSelector((state) => state.DeclineOfferReducer);
    const dispatch = useDispatch();
    const declineHide = () => closeDecline();
    const [declineProduct, setDeclineProduct] = useState([]);
    const [offerDecline, setOfferDecline] = useState([]);
    const [searchInput, setSearchInput] = useState(""); // Step 1: Add a state variable for search input
    const declineHandleChange = () => {
        showdeclinedata()
    }


    const declineDataHandler = (item) => () => {
        setDeclineProduct(() => (
            {
                id: item?.node?.legacyResourceId,
                title: item?.node?.title,
                price: item?.node?.variants?.edges[0]?.node?.price,
                imageSrc: item?.node?.images?.edges[0]?.node?.originalSrc
            }
            ));

      };

    // Create an input element for the search field
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    // Filter the productData array based on the search input value
    const filteredProducts = declineData?.declineData?.data?.products?.edges?.filter(
        (item) =>
            item?.node?.title.toLowerCase().includes(searchInput.toLowerCase()) // Case-insensitive search
    );

    function declineProductList(){
        dispatch(DeclineUpsellAction(declineProduct));
        declineHide();
        declineHandleChange();
        offerDecline.push(declineProduct, ...offerDecline);
    }    

    return(
        <>


            <Modal show={showDecline} onHide={closeDecline}>
                <Modal.Header closeButton>
                <Modal.Title>Create Post-Purchase Accept Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
                <table className="productsdiv w-100">
                    <tbody>
                            {filteredProducts && // Display the filtered products
                                filteredProducts.map((item) => {
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
                                    onChange={declineDataHandler(item)}
                                    checked={declineProduct[item]}
                                    style={{ margin: "20px" }}
                                    type="checkbox"
                                    value={declineProduct[item]}
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
                <Button id="close_btn" onClick={closeDecline}>
                    Cancel
                </Button>
                <Button id="add_btn" type="submit" 
                onClick={() => declineProductList()}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default DeclineModal;