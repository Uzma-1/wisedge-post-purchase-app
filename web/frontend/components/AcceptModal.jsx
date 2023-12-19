import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AcceptOfferReducer } from "../redux/reducer/AcceptOfferReducer";
import { AcceptUpsellAction } from '../redux/action/AcceptUpsellAction';
import Loader from "./Loader";



const AcceptModal = ({showAccpet, closeAccept, showacceptdata}) => {

    const dataShow = useSelector((state) => state.AcceptOfferReducer);
    const dispatch = useDispatch();
    const acceptHide = () => closeAccept();
    const [acceptProduct, setAcceptProduct] = useState([]);
    const [offerAccept, setOfferAccept] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(""); // Step 1: Add a state variable for search input
    const acceptHandleChange = () => {
        showacceptdata()
    }


    const toggleDataHandler = (item) => () => {
        setAcceptProduct(() => (
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
    const filteredProducts = dataShow?.dataShow?.data?.products?.edges?.filter(
        (item) =>
            item?.node?.title.toLowerCase().includes(searchInput.toLowerCase()) // Case-insensitive search
    );


    function acceptProductList(){
        setLoading(true);
        dispatch(AcceptUpsellAction(acceptProduct));
        acceptHide();
        acceptHandleChange();
        offerAccept.push(acceptProduct, ...offerAccept);
        setLoading(false);
    }    

    return(
        <>


            <Modal show={showAccpet} onHide={closeAccept}>
                <Modal.Header closeButton>
                <Modal.Title>Create Post-Purchase Accept Offer</Modal.Title>
                </Modal.Header>
                {
                    loading ?
                    <Loader />
                    :
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
                            {filteredProducts && // Step 5: Display the filtered products
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
                                    onChange={toggleDataHandler(item)}
                                    checked={acceptProduct[item]}
                                    style={{ margin: "20px" }}
                                    type="checkbox"
                                    value={acceptProduct[item]}
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
                }
                <Modal.Footer>
                <Button id="close_btn" onClick={closeAccept}>
                    Cancel
                </Button>
                <Button id="add_btn" type="submit" 
                onClick={() => acceptProductList()}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default AcceptModal;