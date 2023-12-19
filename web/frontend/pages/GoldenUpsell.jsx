import React, { useEffect, useState } from "react";
import search from '../assets/images/search.svg';
import ThreeDots from '../assets/images/three-dots.svg';
import { Link } from "react-router-dom";
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import { useAuthenticatedFetch } from "../hooks";
import Loader from "../components/Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const GoldenUpsell = () => {

	const [users, setUsers] = useState([]);
	const [filteredList, setFilteredList] = useState(users);
	const [sorted, setSorted] = useState({sorted: 'id', reversed: false});
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;
	const lastIndex = currentPage * recordsPerPage;
	const firstIndex = lastIndex - recordsPerPage;
	const records = users.slice(firstIndex, lastIndex);
	const npage = Math.ceil(users.length / recordsPerPage);
	const numbers = [...Array(npage + 1).keys()].slice(1);
	const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
	const [status, setStatus] = useState('');
	const fetch = useAuthenticatedFetch();
	const [loading, setLoading] = useState(false);
	// const [funnelStatus, setFunnelStatus] = useState(users?.funnel_status === "published");
	const [funnelStatus, setFunnelStatus] = useState(false);

	// Calculate the range of page numbers to display
	const pageRange = 3; // Adjust this number to change the number of pages displayed around the current page
	const minPage = Math.max(1, currentPage - pageRange);
	const maxPage = Math.min(npage, currentPage + pageRange);

	// Toaster
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');


  const productList = async () => {
	setLoading(true);
    try {
	const response = await fetch("/api/get-funnel");
      const data = await response.json();
	  const reversedData = [...data].reverse();
      setUsers(reversedData);
	  setFunnelStatus(users.funnel_status === "published");
    } catch (error) {
    //   console.log('Error fetching data:', error);
    }
	setLoading(false);
  };

  useEffect(() => {
    productList();
  }, [])


// Sort Handle

function handleSort(){
	setSorted({ sorted: "Id", reversed: !sorted.reversed});
	const data = [...users];
	data.sort((userA, userB) => {
		if(sorted.reversed){
			return userA.Id - userB.Id;
		}
		return userB.Id - userA.Id;
	});
	setUsers(data);
}

const renderArrow = () => {
	if(sorted.reversed){
		return <FaArrowUp />;
	}
	return <FaArrowDown />
}

// Pagination Handle

function prePage() {
	if(currentPage !== 1){
		setCurrentPage(currentPage - 1)
	}
}

function changeCPage(Id){
	setCurrentPage(Id);
}

function nextPage(){
	if(currentPage !== npage){
		setCurrentPage(currentPage + 1)
	}
}


const actionHandle = (index) => {
setOpenDropdownIndex(index === openDropdownIndex ? null : index);
};

// Delete Funnel
const deleteHandle = (Id) => {
	fetch(`api/delete-funnel/${Id}`, {
	  method: 'DELETE',
	})
	  .then((res) => {
		if (!res.ok) {
		  throw new Error('Network response was not ok');
		}
		return res.json();
	  })
	  .then((data) => {
		setSnackbarMessage(`Funnel record ${Id} deleted!`);
		setSnackbarOpen(true);
		console.log(data);
		
		// Update the users state after successful deletion
		const updatedUsers = users.filter((data) => data.Id !== Id);
		setUsers(updatedUsers);
	  })
	  .catch((error) => {
		// alert(`Error occurred in Delete Funnel: ${error}`);
		setSnackbarMessage(`Error occurred in Delete Funnel: ${error}`);
		setSnackbarOpen(true);
		console.error(error);
	  });
  };

//   Toaster Close
  const handleCloseSnackbar = (event, reason) => {
	if (reason === 'clickaway') {
	  return;
	}
  
	setSnackbarOpen(false);
  };
  
  
// Funnel Status  
const handleStatus = async (e, Id) => {
    const newStatus = e.target.checked;
    
    try {
		await fetch(`/api/update-funnel-status/${Id}`, {
        method: "PUT",
        body: JSON.stringify({ funnel_status: newStatus ? "published" : "unpublished" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      // Update the status locally after successful API update
      const updatedUsers = users.map((data) => {
		if (data.Id === Id) {
		  return { ...data, funnel_status: newStatus ? "published" : "unpublished" };
		}
		return data;
	  });
      
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating funnel status:", error);
    }
  };

// Filter Handle
const handleFilter = (value) => {
    setFilteredList(value); // Update the filtered string
    setCurrentPage(1); // Reset to the first page after filtering
  };




  
    return(
        <>
            {
				loading ?
				<Loader />
				:
				<div className="golden-click-upsell_container">
				<div className="main_title ">
					<h1>Golden Single Click Upsell</h1>
				</div>

				<div className="date_search_funnel justify-content-end">
					<div className="left_search_add">
						<div className="search_item">
							<input id="search" type="text" name="search" placeholder="Search" value={filteredList} onChange={(e) => handleFilter(e.target.value)} />
							<label htmlFor="search">
								<img src={search} alt="search" />
							</label>

						</div>
						<Link id="add-new-funnel" to='/addFunnel'>Add New Funnel</Link>
					</div>
				</div>

			
				<div className="click_upsell_items">
					<div className="sell_item_inr">
						<div className="tr priority" onClick={handleSort}>
							S.No.
							{sorted.sorted === "Id" ? renderArrow() : null}
						</div>
						<div className="tr funnel-name" onClick={handleSort}>
							Funnel Name
							{sorted.sorted === "Id" ? renderArrow() : null}
						</div>
						<div className="tr status">
							Status
						</div>
						<div className="tr actions">
							Actions
						</div>
					</div>
					{
						records && records.filter((data) => {
							if(filteredList == ""){
								return data;
							} else if(data?.funnel_name.toLowerCase().includes(filteredList.toLowerCase())){
								return data;
							}
						}).map((data, i) => {

							// Calculate the serial number based on the current page and index
							const serialNumber = (currentPage - 1) * recordsPerPage + i + 1;

							return(
								<div className="inr_options" key={i}>
									<div className="sell_item_inr">
										<div className="tc priority">{serialNumber}</div>
										<div className="tc funnel-name" onClick={() => actionHandle(i)}>{data?.funnel_name}</div>
										<div className="tc status">
											<label className={`toggle ${data.funnel_status === "published" ? "status-active" : ""}`}>
												<input
												type="checkbox"
												checked={data.funnel_status === "published"}
												onChange={(e) => handleStatus(e, data.Id)} // Pass the funnel ID to the handler
												/>
												<span className="slider"></span>
												{data.funnel_status === "published" ? (
												<span className="labels" data-on="ON"></span>
												) : (
												<span className="labels" data-off="OFF"></span>
												)}
											</label>
										</div>
										<div className="tc action_btns" onClick={() => actionHandle(i)}>
											<img src={ThreeDots} alt="ThreeDots" />
											{openDropdownIndex === i && (
												<div className="dots-wrap">
												<Link to={`/editFunnel/${data?.Id}`}>Edit</Link>
												<Link onClick={() => deleteHandle(data?.Id)}>Delete</Link>
											</div>
											)}
										</div>
									</div>
								</div>
							)
						})
					}
				</div>
				{users.length > recordsPerPage && (
				<nav className="d-flex align-items-center justify-content-between mt-4 pagination-wrap">
					<div className="">
						<p className="my-0">showing {currentPage} to {users.length} of {users.length} entries</p>
					</div>
					<ul className="pagination">
						<li className="page-item">
							<Link to="" className="page-link" onClick={prePage}>
								Prev
							</Link>
						</li>

						{minPage > 1 && (
							<li className="page-item">
							<Link to="#" className="page-link" onClick={() => changeCPage(1)}>
								1
							</Link>
							</li>
						)}
						{minPage > 2 && (
							<li className="page-item disabled">
							<span className="page-link">...</span>
							</li>
						)}

						{
							numbers?.map((n, i) => {
								return(
									<li className={`page-item ${currentPage === n ? 'active' : ""}`} key={i}>
										<Link to="#" className="page-link" onClick={() => changeCPage(n)}>{n}</Link>
									</li>
								)
							})
						}

						{maxPage < npage - 1 && (
							<li className="page-item disabled">
								<span className="page-link">...</span>
							</li>
						)}
						{maxPage < npage && (
							<li className="page-item">
							<Link
								to="#"
								className="page-link"
								onClick={() => changeCPage(npage)}
							>
								{npage}
							</Link>
							</li>
						)}
						<li className="page-item">
							<Link to="#" className="page-link" onClick={nextPage}>
								Next
							</Link>
						</li>
					</ul>
				</nav>
				)}
			</div>	
			}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000} // You can adjust the duration as needed
				onClose={handleCloseSnackbar}
				>
			<MuiAlert
				elevation={6}
				variant="filled"
				onClose={handleCloseSnackbar}
				severity="success" // Change the severity to "error" for error messages
			>
				{snackbarMessage}
			</MuiAlert>
			</Snackbar>

        </>
    )
}

export default GoldenUpsell;