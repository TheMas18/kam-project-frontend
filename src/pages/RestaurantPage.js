import React, { useState, useEffect, useRef } from 'react';
import { getRestaurants, addRestaurant, updateRestaurantStatus, deleteRestaurant, updateRestaurantDetails, getAllStatus, getAllCallFrequency, updateCallFrequencyChange } from '../services/restaurantApiService';

import { clearValidation, ValidateInputFields } from '../components/ValidateInputFields';
import PopUpComponent from '../components/PopUpComponent.js';
import ConfirmationPopup from '../components/ConfirmationPopup.js';
import { Loader, NoDataMessage } from '../components/utils.js';

const RestaurantPage = () => {
    //All the objects restaurant, status,call frequencies
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [allStatus,setAllStatus]=useState([]);
    const [allCallFrequency,setAllCallFrequency]=useState([]);
    const [searchQuery,setSearchQuery]=useState('');// search query for search function
    const [statusFilter, setStatusFilter] = useState('');// filter functionality variables
    const [callFrequencyFilter, setCallFrequencyFilter] = useState(''); // filter functionality variables
    const [editMode, setEditMode] = useState(false); // changing state for update and insert
    const [currentRestaurantId, setCurrentRestaurantId] = useState(null);
    const modalRef = useRef(null); // modal used for popup
    const [currentPage, setCurrentPage] = useState(1);// for pagination
    const [restaurantsPerPage] =useState(7);// for pagination
    //All The fields of restaurants
    const [leadName, setLeadName] = useState('');
    const [leadAddress, setLeadAddress] = useState('');
    const [leadContact, setLeadContact] = useState('');
    const [currentStatus, setCurrentStatus] = useState('NEW');
    const [leadAssignedKam, setLeadAssignedKam] = useState('');
    const [leadCallFrequency, setLeadCallFrequency] = useState('WEEKLY');
    const [leadLastCallDate, setLeadLastCallDate] = useState('');
    const [popup, setPopup] = useState({ type: "", message: "", show: false });//popup functionality
      // Validations field
    const [isValid, setIsValid] = useState({
        leadName: false,
        leadAddress: false,
        leadContact: false,
        leadAssignedKam: false,
        leadLastCallDate: false,
    });
    //Delete Poupup fields
    const [showPopup, setShowPopup] = useState(false);
    const [restaurantIdToDelete, setRestaurantIdToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true); //loading functionality
    //Here,It is fetching and setting  Restaurants and All the status 
    useEffect(() => {
        const fetchData=async()=>{
            setIsLoading(true);
            try {
                const restaurantData = await getRestaurants();
                setRestaurants(restaurantData);
                setFilteredRestaurants(restaurantData); 
                const statusData=await getAllStatus();
                setAllStatus(statusData);
                const callFrequencyData=await getAllCallFrequency();
                setAllCallFrequency(callFrequencyData);
            } 
            catch (error) {console.error("Failed to fetch restaurants:", error);} 
            finally { setIsLoading(false);  }
        }
        fetchData();
            const modalElement = modalRef.current;
            const handleModalClose = () => resetForm();
            if (modalElement) { modalElement.addEventListener('hidden.bs.modal', handleModalClose); }
            return () => { if (modalElement) {  modalElement.removeEventListener('hidden.bs.modal', handleModalClose);  } };
    }, []);
    
   //Input validation
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    const isFieldValid = ValidateInputFields(field, value, e.target,setIsValid);

    if (isFieldValid) {
      setIsValid((prevState) => ({ ...prevState, [field]: true }));
    } else {
      setIsValid((prevState) => ({ ...prevState, [field]: false }));
    }
    switch (field) {
      case 'leadName':
        setLeadName(value);
        break;
      case 'leadAddress':
        setLeadAddress(value);
        break;
      case 'leadContact':
        setLeadContact(value);
        break;
      case 'leadAssignedKam':
        setLeadAssignedKam(value);
        break;
      case 'leadLastCallDate':
        setLeadLastCallDate(value);
        break;
      default:
        break;
    }
  };

    //It will reset all the input fields 
    const resetForm = () => {
        clearValidation();
        setLeadName('');
        setLeadAddress('');
        setLeadContact('');
        setCurrentStatus('NEW');
        setLeadAssignedKam('');
        setLeadLastCallDate('');
        setLeadCallFrequency('')
        setIsValid({
            leadName: false,
            leadAddress: false,
            leadContact: false,
            leadAssignedKam: false,
            leadLastCallDate: false,
        });
        setCurrentRestaurantId(null);
        setEditMode(false);
    };

    //Submit Function and update function 
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        let msg='';
        if (Object.values(isValid).includes(false)) {
            setPopup({ type: "error", message: "Validation failed!", show: true });
            return;
          }
        
        const newRestaurant = {
            restaurantName: leadName,
            address: leadAddress,
            contactNumber: leadContact,
            currentStatus: currentStatus,
            assignedKam: leadAssignedKam,
            callFrequency:leadCallFrequency,
            lastCallDate:leadLastCallDate,
        };
        try {
            if (editMode) {
                //update function 
                const updateRestaurant = await updateRestaurantDetails(currentRestaurantId, newRestaurant);       
                setRestaurants((prev) =>prev.map((restaurant) => restaurant.id == currentRestaurantId ? updateRestaurant : restaurant));
                setFilteredRestaurants((prev) =>prev.map((restaurant) => restaurant.id == currentRestaurantId ? updateRestaurant : restaurant));
                msg='Lead details have been updated successfully...';
            } else {
                //Submit Function
                const addedRestaurant = await addRestaurant(newRestaurant);
                setRestaurants((prev) => [...prev, addedRestaurant]);
                setFilteredRestaurants((prev) => [...prev, addedRestaurant]);
                msg='Lead has been created successfully...';
            }
            setPopup({ type: "success", message:msg, show: true });
            resetForm();
            const modal = window.bootstrap.Modal.getInstance(modalRef.current);
            modal.hide();
        } catch (error) { console.error("Error adding restaurant:", error);}
    };

    //Edit Option : User Can Edit the details
    const handleEdit = (restaurant) => {
        setLeadName(restaurant.restaurantName);
        setLeadAddress(restaurant.address);
        setLeadContact(restaurant.contactNumber);
        setCurrentStatus(restaurant.currentStatus);
        setLeadAssignedKam(restaurant.assignedKam);
        setLeadCallFrequency(restaurant.callFrequency);
        setLeadLastCallDate(restaurant.lastCallDate)
        setCurrentRestaurantId(restaurant.id);
        setIsValid({
            leadName: true,
            leadAddress: true,
            leadContact: true,
            leadAssignedKam: true,
            leadLastCallDate: true,
        });
        setEditMode(true);
        const modal = new window.bootstrap.Modal(modalRef.current);
        modal.show();
    };

    //Delete Function
    const handleDeletePopup = async (restaurantId) => {
        setRestaurantIdToDelete(restaurantId);
        setShowPopup(true);
      };

    const cancelDelete = () => {setShowPopup(false);};
    const handleDelete = async () => {
        try {
            await deleteRestaurant(restaurantIdToDelete);
            setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== restaurantIdToDelete));
            setFilteredRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== restaurantIdToDelete));
            setPopup({ type: "success", message:'Lead Has been Deleted..', show: true });
        } catch (error) {console.error("Error deleting restaurant:", error);}
        setShowPopup(false);
    };
   
    //Change the status  in the table
    const handleStatusChange = async (restaurantId, newStatus) => {
        const updatedRestaurant = await updateRestaurantStatus(restaurantId, newStatus);
        const updatedRestaurants = restaurants.map((restaurant) =>restaurant.id === restaurantId ? { ...restaurant, currentStatus: newStatus } : restaurant);
        setRestaurants(updatedRestaurants);
        const updatedFilteredRestaurants = filteredRestaurants.map((restaurant) =>restaurant.id === restaurantId ? { ...restaurant, currentStatus: newStatus } : restaurant);
        setFilteredRestaurants(updatedFilteredRestaurants);
        setPopup({ type: "success", message:`The status of the lead has been updated to ${newStatus}.`, show: true });
    }

    //Change the Call Frequency in the table
    const  handleCallFrequencyChange=async(restaurantId,newCallFrequency)=>{
        const updatedRestaurant = await updateCallFrequencyChange(restaurantId, newCallFrequency);
        const updatedRestaurants = restaurants.map((restaurant) =>restaurant.id === restaurantId ? { ...restaurant, callFrequency: newCallFrequency } : restaurant);
        setRestaurants(updatedRestaurants);
        const updatedFilteredRestaurants = filteredRestaurants.map((restaurant) =>restaurant.id === restaurantId ? { ...restaurant, callFrequency: newCallFrequency } : restaurant);
        setFilteredRestaurants(updatedFilteredRestaurants);
        setPopup({ type: "success", message:`The call frequency has been updated to ${newCallFrequency}.`, show: true });
    }

 
    //Search Functionality
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = restaurants.filter( (restaurant) =>restaurant.restaurantName.toLowerCase().includes(query) ||restaurant.address.toLowerCase().includes(query) ||restaurant.contactNumber.toLowerCase().includes(query) ||restaurant.assignedKam.toLowerCase().includes(query));
        setFilteredRestaurants(filtered);
        setCurrentPage(1);
    };

    //Filter Button Functionality
    const handleStatusFilterChange = (selectedStatus) => {
        setStatusFilter(selectedStatus);
        if (selectedStatus === '') {
            setFilteredRestaurants(restaurants.filter((restaurant) =>
                restaurant.restaurantName.toLowerCase().includes(searchQuery) ||
                restaurant.address.toLowerCase().includes(searchQuery) ||
                restaurant.contactNumber.toLowerCase().includes(searchQuery) ||
                restaurant.assignedKam.toLowerCase().includes(searchQuery)
            ));
        } else {
            setFilteredRestaurants(restaurants.filter((restaurant) =>
                restaurant.currentStatus === selectedStatus &&
                (restaurant.restaurantName.toLowerCase().includes(searchQuery) ||
                    restaurant.address.toLowerCase().includes(searchQuery) ||
                    restaurant.contactNumber.toLowerCase().includes(searchQuery) ||
                    restaurant.assignedKam.toLowerCase().includes(searchQuery))
            ));
        }
        setCurrentPage(1); // Reset to the first page
    };
    
    const handleCallFrequencyFilterChange = (selectedFrequency) => {
        setCallFrequencyFilter(selectedFrequency);
        if (selectedFrequency === '') {
            setFilteredRestaurants(restaurants.filter((restaurant) =>
                restaurant.restaurantName.toLowerCase().includes(searchQuery) ||  restaurant.address.toLowerCase().includes(searchQuery) ||
                restaurant.contactNumber.toLowerCase().includes(searchQuery)  ||  restaurant.assignedKam.toLowerCase().includes(searchQuery)
            ));
        } else {
            setFilteredRestaurants(restaurants.filter((restaurant) =>
                restaurant.callFrequency === selectedFrequency &&
                (restaurant.restaurantName.toLowerCase().includes(searchQuery) ||  restaurant.address.toLowerCase().includes(searchQuery) ||
                restaurant.contactNumber.toLowerCase().includes(searchQuery)   ||  restaurant.assignedKam.toLowerCase().includes(searchQuery))
            ));
        }
        setCurrentPage(1); // Reset to the first page
    };

    //Pagination Implementation
    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(filteredRestaurants.length / restaurantsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const renderPagination = () => {
        const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn"  onClick={() => handlePagination('prev')}  disabled={currentPage === 1} >  Prev </button>
                <span className="pagination-info">  {currentPage} / {totalPages} </span>
                <button className="pagination-btn" onClick={() => handlePagination('next')}  disabled={currentPage === totalPages} >  Next </button>
            </div>
        );
    };
   
    return (
        <div className="container mt-2">
          {popup.show && (
                <PopUpComponent
                    type={popup.type}
                    message={popup.message}
                    onClose={() => setPopup({ ...popup, show: false })}
                />
            )}
            <h3 className='text-center'>List of Restaurants</h3>
            <div className='container '>
        
                <div className='container bg-dark p-3 d-flex justify-content-between'>
                    <div className='text-start d-flex align-items-center'>
                        {/* Search Functionality  */}
                        <div className="searchBox">
                            <input className="searchInput" value={searchQuery} onChange={handleSearch} type="text" name="" placeholder="Search something" />
                            <button className="searchButton" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <g clipPath="url(#clip0_2_17)"> <g filter="url(#filter0_d_2_17)"> <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path> </g></g>
                                    <defs>
                                        <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend></filter>
                                        <clipPath id="clip0_2_17"><rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect></clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                         {/* Filter Button Functionality  */}
                         <div className="filter-dropdown ms-4">
                                  <button className="btn btn-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            Filter
                                    </button>
                                        <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                                            <li className="dropdown-submenu">
                                                <a className="dropdown-item dropdown-toggle" href="#">Status</a>
                                                <ul className="dropdown-menu">
                                                    {allStatus.map((status) => (
                                                        <li key={status}>
                                                            <a className="dropdown-item" href="#" onClick={() => handleStatusFilterChange(status)}>
                                                                {status}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li className="dropdown-submenu">
                                                <a className="dropdown-item dropdown-toggle" href="#">Call Frequency</a>
                                                <ul className="dropdown-menu">
                                                    {allCallFrequency.map((frequency) => (
                                                        <li key={frequency}>
                                                            <a className="dropdown-item" href="#" onClick={() => handleCallFrequencyFilterChange(frequency)}>
                                                                {frequency}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                          </div>
                        
                    </div>
                    <div className="text-end add-lead-Btn-style">
                     {/* Insert Lead Functionality  */}
                        <button className="noselect" data-bs-toggle="modal" data-bs-target="#addHotelModal">
                            <span className="text">Add Lead</span><span className="icon">
                            <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" > </svg>
                            <span className="buttonSpan">+</span>
                            </span>
                        </button>
                    </div>
                </div>
                 {/* Display All Leads  */}
                 <div className="table-responsive" style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <table className="table mt-1 table-striped table-hover">
                        <thead>
                            <tr className='table-dark'>
                                <th scope="col">ID</th>
                                <th scope="col">Restaurant Name</th>
                                <th scope="col">Address</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Assigned KAM</th>
                                <th scope="col">Current Status</th>
                                <th scope="col">Call Frequency</th>
                                <th scope="col">Last Call Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                            {isLoading ? (<tr><td colSpan="9"><Loader /></td> </tr>)  : currentRestaurants.length===0 ? ( <tr><td><NoDataMessage/></td></tr>) :
                                ( currentRestaurants.map((restaurant) => (
                                        <tr key={restaurant.id}>
                                            <th scope="row">{restaurant.id}</th>
                                            <td>{restaurant.restaurantName}</td>
                                            <td>{restaurant.address}</td>
                                            <td>{restaurant.contactNumber}</td>
                                            <td>{restaurant.assignedKam}</td>
                                            <td>
                                                <div className="radio-input-lead">
                                                    {allStatus.map((status) => (
                                                        <div key={`${restaurant.id}-${status}`} className="me-2">
                                                            <input 
                                                                type="radio" 
                                                                id={`status-${restaurant.id}-${status}`}  
                                                                name={`status-${restaurant.id}`}
                                                                value={status}
                                                                checked={restaurant.currentStatus === status}
                                                                onChange={() => handleStatusChange(restaurant.id, status)}  
                                                            />
                                                            <label htmlFor={`status-${restaurant.id}-${status}`}>{status}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <select 
                                                    className="form-select" 
                                                    value={restaurant.callFrequency}  
                                                    onChange={(e) => handleCallFrequencyChange(restaurant.id, e.target.value)} 
                                                >
                                                    {allCallFrequency.map((frequency) => (
                                                        <option key={frequency} value={frequency}>  {frequency} </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{restaurant.lastCallDate}</td>
                                            <td> 
                                                <button className="btn btn-success m-1" onClick={() => handleEdit(restaurant)} > 
                                                    <i className="fa-solid fa-pen-to-square"></i> 
                                                </button>
                                                <button className="btn btn-danger m-1" onClick={() => handleDeletePopup(restaurant.id)} >  
                                                    <i className="fa-solid fa-trash"></i>   
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                
                            </tbody>
                    </table>
</div>
                 {/* Pagination Functionality  */}
                {renderPagination()}       
            </div>
            <ConfirmationPopup show={showPopup} onConfirm={handleDelete}  onCancel={cancelDelete}  message="Are you sure you want to delete this restaurant?"/>
            {/* Modal for Adding Restaurant  */}
            <div className="modal fade" id="addHotelModal"  tabIndex="-1"  aria-labelledby="addHotelModalLabel" aria-hidden="true"  ref={modalRef}  data-bs-backdrop="static" data-bs-keyboard="false"  >
           
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: '#9f0005' }}>
                            <div className='w-100 d-flex justify-content-center'>
                                <h5 className="modal-title" id="addHotelModalLabel" style={{ color: 'white' }}>Add Restaurant</h5>
                            </div>
                            <div className='custom-popup-close-btn'>
                                <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"   onClick={resetForm}></button>
                            </div>

                        </div>
                         {/* Input Popup Box Functionality  */}
                        <div className=" modal-body" style={{ backgroundColor: '#e8e8e8' }}>
                            <form onSubmit={handleLeadSubmit}>
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadName" className="text form-label">Lead Name</label>
                                        <input type="text" className="input form-control" id="leadName"
                                            value={leadName} onChange={(e) => handleInputChange(e, "leadName")} 
                                            placeholder="Enter lead name" autoComplete='off'  maxLength="25"  required />
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadAddress" className=" text form-label">Address</label>
                            
                                        <input type="text" className="input form-control" id="leadAddress" 
                                            value={leadAddress} placeholder="Enter address"
                                            onChange={(e) => handleInputChange(e, "leadAddress")} maxLength="100" autoComplete='off'  required  />
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadContact" className="text form-label">Contact Number</label>
                                        <input  type="tel" className="input form-control"
                                            id="leadContact" value={leadContact}
                                            onChange={(e) => handleInputChange(e, "leadContact")}
                                            placeholder="Enter contact number" required
                                        />
                                </div>
                                <div className="mb-3" style={{ color: '#818CF8', fontSize: ' 0.75rem', fontWeight: '700' }}>
                                    <label htmlFor="currentStatus" className="form-label">Status</label>
                                    <div className="radio-input-lead">
                                        {allStatus.map((status) => (
                                            <div key={status}>
                                                <input  type="radio"  id={status} name="currentStatus"
                                                    value={status}
                                                    checked={currentStatus === status}
                                                    onChange={() => setCurrentStatus(status)}  required />
                                                <label htmlFor={status}>{status}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>      
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadCallFrequency" className="text form-label">
                                        Select Call Frequency
                                    </label>
                                    <select
                                        className="form-select"
                                        id="leadCallFrequency"
                                        value={leadCallFrequency}
                                        onChange={(e) => setLeadCallFrequency(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Call-Frequency</option>
                                        {allCallFrequency.map((frequency) => (
                                            <option key={frequency} value={frequency}>
                                                {frequency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadLastCallDate" className="text form-label">Last Call Date</label>
                                    <input type="date"  className="input form-control" id="leadLastCallDate"
                                        value={leadLastCallDate}    onChange={(e) => handleInputChange(e,"leadLastCallDate")}  required  />
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="leadAssignedKam" className="text form-label">Assigned KAM</label>
                                    <input  type="text" className="input form-control" id="leadAssignedKam"
                                           value={leadAssignedKam} placeholder="Enter assigned KAM"
                                           onChange={(e) => handleInputChange(e, "leadAssignedKam")} required />
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button type="submit" className="btn btn-success">  {editMode ? 'Update' : 'Submit'} </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantPage;
