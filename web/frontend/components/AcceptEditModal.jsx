import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { EditAcceptProReducer } from '../redux/reducer/EditAcceptProReducer';
import { EditAcceptUpsellAction } from '../redux/action/EditAcceptOffer';

const AcceptEditModal = ({ showEditAccept, hideEditAccept }) => {
  const [editData, setEditData] = useState([]);
  const [offer, setOffer] = useState([]);
  const editAcceptData = useSelector((state) => state.EditAcceptProReducer);
  const [searchInput, setSearchInput] = useState(""); // Step 1: Add a state variable for search input
  const dispatch = useDispatch();

  const handleClose = () => {
    hideEditAccept();
  };


  const toggleHandler = (item) => () => {
    setEditData(() => (
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
  const filteredProducts = editAcceptData?.editAcceptData?.data?.products?.edges?.filter(
      (item) =>
          item?.node?.title.toLowerCase().includes(searchInput.toLowerCase()) // Case-insensitive search
  );

  function sendAcceptData() {
    dispatch(EditAcceptUpsellAction(editData));
    offer.push(editData, setOffer);
    // console.log(editData, "edit data");
    hideEditAccept();
  }

  return (
    <>
      <Modal show={showEditAccept} onHide={hideEditAccept}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post-Purchase Offer</Modal.Title>
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
            {
              filteredProducts && // Display the filtered products
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
                      onChange={toggleHandler(item)}
                      checked={setEditData[item]}
                      style={{ margin: "20px" }}
                      type="checkbox"
                      value={setEditData[item]}
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
          <Button id="close_btn" onClick={handleClose}>
            Cancel
          </Button>
          <Button id="add_btn" type="submit" onClick={sendAcceptData}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptEditModal;
