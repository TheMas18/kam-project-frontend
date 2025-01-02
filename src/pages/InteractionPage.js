import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { getRestaurantById, getRestaurants } from '../services/restaurantApiService';
import { addInteraction, deleteInteraction, getInteractions, getInteractionTypes, updateInteracitonType, updateInteractionDetails, updateInteractionFollowUp } from '../services/interactionApiService';
import '../assets/css/style.css';
import PopUpComponent from '../components/PopUpComponent';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { clearValidation, ValidateInputFields } from '../components/ValidateInputFields';
export default function InteractionPage() {
    //All the objects interactions, restaurant, interaction types 
    const [interactions, setInteractions] = useState([]);
    const [filteredInteractions, setFilteredInteractions] = useState([]);
    const [allInteractionTypes, setAllInteractionTypes] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');// search query for search function
    const [interactionTypeFilter,setInteractionTypeFilter]=useState('');// filter functionality variables
    const [interactionFollowUpFilter,setInteractionFollowUpFilter]=useState('');// filter functionality variables
    const [currentPage, setCurrentPage] = useState(1);// for pagination
    const [interactionsPerPage] = useState(7);// for pagination
    const [editMode, setEditMode] = useState(false);// changing state for update and insert
    const [currentInteractionId, setCurrentInteractionId] = useState(null);
    const modalRef = useRef(null);// modal used for popup
     //All The fields of interactions
    const [interactionDate, setInteractionDate] = useState('');
    const [interactionType, setInteractionType] = useState('CALL');
    const [interactionNotes, setInteractionNotes] = useState('');
    const [interactionFollowUpRequired, setInteractionFollowUpRequired] = useState(false);
    const [interactionLoggedBy, setInteractionLoggedBy] = useState('');
    const [interactionRestaurantID, setInteractionRestaurantID] = useState('');
    const [popup, setPopup] = useState({ type: "", message: "", show: false });//popup functionality
        // Validations field
    const [isValid, setIsValid] = useState({
        interactionDate: false,
        interactionNotes: false,
        interactionLoggedBy: false,
    });
    //Delete Poupup fields
    const [showPopup, setShowPopup] = useState(false);
    const [interactionIdToDelete, setInteractionIdToDelete] = useState(null);
    //Here,It is fetching and setting  Interactions
    useEffect(() => {
        const fetchData = async() => {
            try {
                const interactionsData = await getInteractions();
                setInteractions(interactionsData);
                setFilteredInteractions(interactionsData)
                const interactionTypeData = await getInteractionTypes();
                setAllInteractionTypes(interactionTypeData);
                const restaurantsData = await getRestaurants();
                setRestaurants(restaurantsData);
            } catch (error) { console.error('Failed to fetch interactions:', error); }    
        }
        fetchData();
        const modalElement = modalRef.current;
        const handleModalClose = () => resetForm();
        if (modalElement) { modalElement.addEventListener('hidden.bs.modal', handleModalClose); }
        return () => { if (modalElement) { modalElement.removeEventListener('hidden.bs.modal', handleModalClose); } };
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
          case 'interactionDate':
            setInteractionDate(value);
            break;
          case 'interactionNotes':
            setInteractionNotes(value);
            break;
          case 'interactionLoggedBy':
            setInteractionLoggedBy(value);
            break;
          default:
            break;
        }
      };

    //It will reset all the input fields 
    const resetForm = () => {
        clearValidation();
        setInteractionDate('');
        setInteractionLoggedBy('');
        setInteractionType('CALL');
        setInteractionNotes('');
        setInteractionFollowUpRequired(false);
        setInteractionRestaurantID('');
        setCurrentInteractionId(null);
        setIsValid({
            interactionDate: false,
            interactionNotes: false,
            interactionLoggedBy: false,
        })
        setEditMode(false);
    };
    //Submit Function and update function 
    const handleInteractionSubmit = async (e) => {
        e.preventDefault();
        let msg='';
        console.log(interactionRestaurantID);
        if (Object.values(isValid).includes(false)) {
            setPopup({ type: "error", message: "Validation failed!", show: true });
            return;
          }
        const newInteraction = {
            restaurant: { id: interactionRestaurantID, },
            dateOfInteraction: interactionDate,
            interactionType: interactionType,
            notes: interactionNotes,
            followUpRequired: interactionFollowUpRequired,
            loggedBy: interactionLoggedBy
        };
        try {
            if (editMode) {
                const updateInteraction = await updateInteractionDetails(currentInteractionId, newInteraction);
                setInteractions((prev) => prev.map((interaction) => interaction.id === currentInteractionId ? updateInteraction : interaction))
                setFilteredInteractions((prev) => prev.map((interaction) => interaction.id === currentInteractionId ? updateInteraction : interaction))
                msg='Interaction details have been updated successfully...';
            }
            else {
                console.log(newInteraction);
                const addInteractionDetails = await addInteraction(newInteraction);
                setInteractions((prev) => [...prev, addInteractionDetails]);
                setFilteredInteractions((prev) => [...prev, addInteractionDetails]);
                msg='Interaction has been created successfully...';
                console.log(interactions);
            }
            setPopup({ type: "success", message:msg, show: true });
            resetForm();
            const modal = window.bootstrap.Modal.getInstance(modalRef.current);
            modal.hide();
        } catch (error) { console.error('Error adding interactions:', error); }
    }
    //Edit Option : User Can Edit the details
    const handleInteractionEdit = (interaction) => {
        setInteractionDate(interaction.dateOfInteraction);
        setInteractionLoggedBy(interaction.loggedBy);
        setInteractionType(interaction.interactionType);
        setInteractionNotes(interaction.notes);
        setInteractionFollowUpRequired(interaction.followUpRequired);
        setInteractionRestaurantID(interaction.restaurantId);
        setCurrentInteractionId(interaction.id);
        setIsValid({
            interactionDate: true,
            interactionNotes: true,
            interactionLoggedBy: true,
        });
        setEditMode(true);
        const modal = new window.bootstrap.Modal(modalRef.current);
        modal.show();
    };

    //Delete Function
    const handleDeletePopup = async (interactionId) => {
        setInteractionIdToDelete(interactionId);
        setShowPopup(true);
      };
    const cancelDelete = () => {setShowPopup(false);};
    const handleInteractionDelete = async () => {
        try {
            await deleteInteraction(interactionIdToDelete);
            setInteractions((prev) => prev.filter((interactions) => interactions.id != interactionIdToDelete));
            setFilteredInteractions((prev) => prev.filter((interactions) => interactions.id != interactionIdToDelete));
            setPopup({ type: "success", message:'Interaction Has been Deleted..', show: true });
        } catch (error) {console.error("Error deleting interaction:", error);}
        setShowPopup(false);
    }

    //Change the InteractionType
    const handleInteractionTypeChange = async (interactionId, newType) => {
        try {
            const updatedInteractionType = await updateInteracitonType(interactionId, newType);
            console.log(updatedInteractionType)
            const updatedInteractions = interactions.map((interaction) => interaction.id == interactionId ? { ...interaction, interactionType: updatedInteractionType.interactionType } : interaction)
            setInteractions(updatedInteractions);
            setFilteredInteractions(updatedInteractions);
            setPopup({ type: "success", message:`The type of interaction has been updated to ${newType}.`, show: true });
        } catch (error) {
            console.log('Error deleting interactions:', error)
        }
    }
    //change the follow up on table
    const handleFollowUpChange = async (interactionId, isFollowUpRequired) => {
        try {
            await updateInteractionFollowUp(interactionId, isFollowUpRequired);
            setInteractions((prevInteractions) => prevInteractions.map((interaction) => interaction.id === interactionId  ? { ...interaction, followUpRequired: isFollowUpRequired } : interaction ));
            setFilteredInteractions((prevInteractions) => prevInteractions.map((interaction) => interaction.id === interactionId ? { ...interaction, followUpRequired: isFollowUpRequired } : interaction));
            setPopup({ type: "success", message:`The FollowUp Status has been updated to ${isFollowUpRequired?'YES' :'NO'}.`, show: true });
        } catch (error) { console.error('Error updating follow-up status:', error); }
    };

    //Filter Button Functionality
    const handleInteractionTypeFilterChange = (interactionType) => {
        setInteractionTypeFilter(interactionType);
        if (interactionType === '') {
            setFilteredInteractions(interactions.filter((interaction) => interaction.restaurantName.toLowerCase().includes(searchQuery) || interaction.loggedBy.toLowerCase().includes(searchQuery) ));
        } else {
            setFilteredInteractions(interactions.filter((interaction) => interaction.interactionType === interactionType && (interaction.restaurantName.toLowerCase().includes(searchQuery) || interaction.loggedBy.toLowerCase().includes(searchQuery)) ));
        }
        setCurrentPage(1); // Reset to the first page
    };

   
    const handleFollowUpFilterChange = (followUpRequired) => {
        setInteractionFollowUpFilter(followUpRequired);
        if (followUpRequired === '') {
            setFilteredInteractions(interactions.filter((interaction) => interaction.restaurantName.toLowerCase().includes(searchQuery) || interaction.loggedBy.toLowerCase().includes(searchQuery) ));
        } else {
            setFilteredInteractions(interactions.filter((interaction) => interaction.followUpRequired === followUpRequired && (interaction.restaurantName.toLowerCase().includes(searchQuery) || interaction.loggedBy.toLowerCase().includes(searchQuery)) ));
        }
        
        setCurrentPage(1); // Reset to the first page
    };
    //Pagination Implementation
    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(filteredInteractions.length / interactionsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastInteraction = currentPage * interactionsPerPage;
    const indexOfFirstInteraction = indexOfLastInteraction - interactionsPerPage;
    const currentInteractions = filteredInteractions.slice(indexOfFirstInteraction, indexOfLastInteraction);
    const renderPagination = () => {
        const totalPages = Math.ceil(filteredInteractions.length / interactionsPerPage);
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn" onClick={() => handlePagination('prev')} disabled={currentPage === 1}>  Prev </button>
                <span className="pagination-info"> {currentPage} / {totalPages} </span>
                <button className="pagination-btn"  onClick={() => handlePagination('next')} disabled={currentPage === totalPages}> Next </button>
            </div>
        );
    };

    //Search Functionality
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = interactions.filter((interaction) => interaction.restaurantName.toLowerCase().includes(query) || interaction.loggedBy.toLowerCase().includes(query))
        setFilteredInteractions(filtered);
        setCurrentPage(1);
    }
    return (
        <div className="container mt-2">
          {popup.show && (
                <PopUpComponent
                    type={popup.type}
                    message={popup.message}
                    onClose={() => setPopup({ ...popup, show: false })}
                />
            )}
            <h3 className='text-center'>List of Interactions</h3>
            <div className='container '>
                <div className='container bg-dark p-3 d-flex justify-content-between'>
                    <div className='text-start d-flex align-items-center'>
                        <div className="searchBox">
                            <input className="searchInput" value={searchQuery} onChange={handleSearch} type="text" name="" placeholder="Search something" />
                            <button className="searchButton" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <g clipPath="url(#clip0_2_17)"><g filter="url(#filter0_d_2_17)">  <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path></g></g>
                                    <defs>
                                        <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="4"></feOffset> <feGaussianBlur stdDeviation="2"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                                        </filter>
                                        <clipPath id="clip0_2_17">
                                            <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                                        </clipPath>
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
                                                <a className="dropdown-item dropdown-toggle" href="#">InteractionType</a>
                                                <ul className="dropdown-menu">
                                                    {allInteractionTypes.map((types) => (
                                                        <li key={types}>
                                                            <a className="dropdown-item" href="#" onClick={() => handleInteractionTypeFilterChange(types)}>
                                                                {types}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li className="dropdown-submenu">
                                                <a className="dropdown-item dropdown-toggle" href="#">FollowUp</a>
                                                <ul className="dropdown-menu">
                                                    {[true,false].map((followup) => (
                                                        <li key={followup}>
                                                            <a className="dropdown-item" href="#" onClick={() => handleFollowUpFilterChange(followup)}>
                                                                {followup ? "Yes" : "No"}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                          </div>
                        
                    </div>
                    <div className="text-end add-lead-Btn-style">
                        <button className="noselect" data-bs-toggle="modal" data-bs-target="#addLog">
                            <span className="text">Add Log</span>
                            <span className="icon">
                                <svg  viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"  >  </svg>
                                <span className="buttonSpan">+</span>
                            </span>
                        </button>
                    </div>
                </div>
                <table className="table mt-1  table-striped table-hover" >
                    <thead >
                        <tr className='table-dark'>
                            <th scope="col">ID</th>
                            <th scope="col">Restaurant Name</th>
                            <th scope="col">Date Of Interaction</th>
                            <th scope="col">InteractionType</th>
                            <th scope="col">Notes</th>
                            <th scope="col">Follow-Up  Required</th>
                            <th scope="col">loggedBy</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInteractions.map((interaction) => (
                            <tr key={interaction.id}>
                                <th scope="row">{interaction.id}</th>
                                <td>{interaction.restaurantName}</td>
                                <td>{interaction.dateOfInteraction}</td>
                                <td>
                                    <div className='radio-input-lead'>
                                        {allInteractionTypes.map((intactType) => (
                                            <div key={`${interaction.id}-${intactType}`} className='me-2'>
                                                <input type="radio" id={`type-${interaction.id}-${intactType}`}  name={`interactionType-${interaction.id}`}
                                                    value={intactType} checked={interaction.interactionType === intactType}
                                                    onChange={() => handleInteractionTypeChange(interaction.id, intactType)} />
                                                <label htmlFor={`type-${interaction.id}-${intactType}`}>{intactType}</label>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>{interaction.notes}</td>
                                <td>
                                    <label className="checkbox-followup-container d-flex">
                                        <input type="checkbox"  id="interactionFollowUpRequired" checked={interaction.followUpRequired}
                                             onChange={(e) => handleFollowUpChange(interaction.id, e.target.checked)} />
                                        <div className="checkmark"></div>
                                        <label htmlFor="interactionFollowUpRequired" className="ms-3 fs-5  mt-1">  {interaction.followUpRequired ? "Yes" : "No"}   </label>
                                    </label>
                                </td>
                                <td>{interaction.loggedBy}</td>
                                <td> <button className="btn btn-success m-1" onClick={() => handleInteractionEdit(interaction)}> <i className="fa-solid fa-pen-to-square"></i> </button>
                                    <button className="btn btn-danger m-1"  onClick={() => handleDeletePopup(interaction.id)}  >  <i className="fa-solid fa-trash"></i> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {/* Pagination Functionality  */}
                {renderPagination()}
            </div>
            <ConfirmationPopup show={showPopup} onConfirm={handleInteractionDelete}  onCancel={cancelDelete}  message="Are you sure you want to delete this Contact?"/>
         
            {/* Modal for Adding Interaction Log */}
            <div   className="modal fade"  id="addLog"  tabIndex="-1" aria-labelledby="addLoglModalLabel"  aria-hidden="true"  ref={modalRef}   data-bs-backdrop="static"   data-bs-keyboard="false"  >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: '#9f0005' }}>
                            <div className='w-100 d-flex justify-content-center'>
                                <h5 className="modal-title" id="addHotelModalLabel" style={{ color: 'white' }}>Add Interaction Log</h5>
                            </div>
                            <div className='custom-popup-close-btn'>
                                <button type="button" className="btn-close " data-bs-dismiss="modal"  aria-label="Close" onClick={resetForm} ></button>
                            </div>
                        </div>
                        <div className=" modal-body" style={{ backgroundColor: '#e8e8e8' }}>
                            <form onSubmit={handleInteractionSubmit}>
                                <div className="coolinput mb-3">
                                    <label htmlFor="interactionRestaurantID" className="text form-label">
                                        Select Restaurant
                                    </label>
                                    <select className="form-select"
                                        id="interactionRestaurantID" 
                                        value={interactionRestaurantID}  onChange={(e) => setInteractionRestaurantID(e.target.value)} required  >
                                        <option value="">Select Restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant.id} value={restaurant.id}>  {restaurant.restaurantName}  </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="interactionDate" className="text form-label">Date Of Interaction</label>
                                    <input type="date"  className="input form-control" id="interactionDate"
                                        value={interactionDate}  onChange={(e) => handleInputChange(e,"interactionDate")}  required  />
                                </div>
                                <div className="mb-3" style={{ color: '#818CF8', fontSize: ' 0.75rem', fontWeight: '700' }}>
                                    <label htmlFor="interactionType" className="form-label">Interaction Type</label>
                                    <div className="radio-input-lead">
                                        {allInteractionTypes.map((itype) => (
                                            <div key={itype}>
                                                <input type="radio"  id={itype} name="interactionType" value={itype}
                                                    checked={interactionType === itype}
                                                    onChange={() => setInteractionType(itype)}  required />
                                                <label htmlFor={itype}>{itype}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="interactionNotes" className="text form-label">Notes</label>
                                    <input type="text"  className="input form-control" id="interactionNotes"
                                        value={interactionNotes}  onChange={(e) => handleInputChange(e,"interactionNotes")}  placeholder="Enter Notes / Description"  required  />
                                </div>
                                <div className="mb-3" style={{ color: '#818CF8', fontSize: ' 0.75rem', fontWeight: '700' }}>
                                    <label htmlFor="interactionFollowUpRequired" className="text form-label">Follow-Up Required</label>
                                    <div className='container'>
                                        <label className="followUp-Switch">
                                            <input type="checkbox" checked={interactionFollowUpRequired}
                                                onChange={(e) => setInteractionFollowUpRequired(e.target.checked) }  />
                                            <span className="slider-followUp"></span>
                                        </label>
                                        <label htmlFor="interactionFollowUpRequired" className="ms-3 fs-5 mt-2"> {interactionFollowUpRequired ? "Yes" : "No"} </label>
                                    </div>
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="interactionLoggedBy" className="text form-label">Logged By</label>
                                    <input type="text"   className="input form-control"  id="interactionLoggedBy"  value={interactionLoggedBy} onChange={(e) => handleInputChange(e,"interactionLoggedBy")} placeholder="Enter Name Of KAM" required   />
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
    )
}
