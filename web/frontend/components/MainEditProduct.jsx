import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { EditMainProReducer } from '../redux/reducer/EditMainProReducer';
import { EditMainUpsellAction } from '../redux/action/EditMainUpsellAction';

const MainEditProduct = ({ show, onHide, getMainData }) => {
  const [editData, setEditData] = useState([]);
  const [offer, setOffer] = useState([]);
  const data = getMainData;
  const editMainData = useSelector((state) => state.EditMainProReducer);
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState(""); // Step 1: Add a state variable for search input

  const handleClose = () => {
    onHide();
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
  const filteredProducts = editMainData?.editMainData?.data?.products?.edges?.filter(
      (item) =>
          item?.node?.title.toLowerCase().includes(searchInput.toLowerCase()) // Case-insensitive search
  );

  function sendMainData() {
    dispatch(EditMainUpsellAction(editData));
    offer.push(editData, setOffer);
    handleClose();
  }

  return (
    <>
      <Modal show={show} onHide={onHide}>
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
          <Button id="add_btn" type="submit" onClick={sendMainData}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainEditProduct;
