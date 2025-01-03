import React, { useEffect, useRef, useState } from 'react';
import { addContact, deleteContact, getContacts, getContactsByRestaurantId, getRoles, updateContactDetails, updateContactRole } from '../services/contactApiService';
import { getRestaurants } from '../services/restaurantApiService';
import ConfirmationPopup from '../components/ConfirmationPopup';
import PopUpComponent from '../components/PopUpComponent';
import { clearValidation, ValidateInputFields } from '../components/ValidateInputFields';
import { Loader, NoDataMessage } from '../components/utils';

export default function ContactPage() {
    //All the objects contacts, restaurants ,roles
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');// search query for search function
    const [roleFilter, setRoleFilter] = useState('');// filter functionality variables
    const [editMode, setEditMode] = useState(false);// changing state for update and insert
    const modalRef = useRef(null);// modal used for popup
    const [contactsPerPage] = useState(2); // for pagination
    const [currentPage, setCurrentPage] = useState(1); // for pagination
    const [currentContactId, setCurrentContactId] = useState(null);
    //All the fields of restaurants
    const [contactEmail, setContactEmail] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [contactRestaurantId, setContactRestaurantId] = useState('');
    const [popup, setPopup] = useState({ type: "", message: "", show: false });//popup functionality
      // Validations field
    const [isValid, setIsValid] = useState({
        contactEmail: false,
        contactName: false,
        contactPhoneNumber: false,
    });
    //Delete Poupup fields
    const [showPopup, setShowPopup] = useState(false);
    const [contactIdToDelete, setContactIdToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true); //loading functionality
    //Here,It is fetching and setting  Restaurants and All the status 
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const restaurantData = await getRestaurants();
                setRestaurants(restaurantData);
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {  console.error('Failed to fetch contacts:', error);  }
            finally { setIsLoading(false);  }
        }
        fetchData();
        fetchContacts();
        const modalElement = modalRef.current;
        const handleModalClose = () => resetForm();
        if (modalElement) { modalElement.addEventListener('hidden.bs.modal', handleModalClose); }
        return () => { if (modalElement) { modalElement.removeEventListener('hidden.bs.modal', handleModalClose); } };
    }, []);


    const fetchContacts = async (restaurantId) => {
        try {
            let data;
            if (restaurantId) { data = await getContactsByRestaurantId(restaurantId); }
            else { data = await getContacts(); }
            setContacts(data);
            setFilteredContacts(data);
            console.log(data)
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        }
    };

    //It will reset all the input fields 
    const resetForm = () => {
         clearValidation();
        setContactEmail('');
        setContactName('');
        setContactPhoneNumber('');
        setContactRole('');
        setContactRestaurantId('');
        setIsValid({
            contactEmail: false,
            contactName: false,
            contactPhoneNumber: false,
        })
        setEditMode(false);
        setCurrentContactId(null);
    };

    //Submit Function and update function 
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        let msg='';
        console.log(contactRestaurantId)
        if (Object.values(isValid).includes(false)) {
            setPopup({ type: "error", message: "Validation failed!", show: true });
            return;
        }
        const newContact = {
            email: contactEmail,
            name: contactName,
            phoneNumber: contactPhoneNumber,
            role: contactRole,
            restaurant: { id: contactRestaurantId },
        };
        try {
            if (editMode) {
                //update function 
                const updateContact = await updateContactDetails(currentContactId, newContact);
                setContacts((prev) =>
                    prev.map((contact) => contact.id == currentContactId ? updateContact : contact)
                );
                setFilteredContacts((prev) =>
                    prev.map((contact) => contact.id == currentContactId ? updateContact : contact)
                );
                msg='Contact details have been updated successfully...';
            } else {
                console.log(newContact);
                //Submit Function
                const addContactDetails = await addContact(newContact);
                setContacts((prev) => [...prev, addContactDetails]);
                setFilteredContacts((prev) => [...prev, addContactDetails]);
                msg='Contact has been created successfully...';
                console.log(contacts);
            }
            setPopup({ type: "success", message:msg, show: true });
            resetForm();
            const modal = window.bootstrap.Modal.getInstance(modalRef.current); // Correct way to get the modal instance
            modal.hide();
        } catch (error) { console.error('Error adding contacts:', error); }
    };
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
          case 'contactEmail':
            setContactEmail(value);
            break;
          case 'contactName':
            setContactName(value);
            break;
          case 'contactPhoneNumber':
            setContactPhoneNumber(value);
            break;
          default:
            break;
        }
      };
    //Edit Option : User Can Edit the details
    const handleContactEdit = (contact) => {
        setContactEmail(contact.email);
        setContactName(contact.name);
        setContactPhoneNumber(contact.phoneNumber);
        setContactRole(contact.role);
        setContactRestaurantId(contact.restaurantId);
        setCurrentContactId(contact.id);
        setIsValid({
            contactEmail: true,
            contactName: true,
            contactPhoneNumber: true,
        })
        setEditMode(true);
        const modal = new window.bootstrap.Modal(modalRef.current);
        modal.show();
    };

    //Change the role  in the table
    const handleRoleChange = async (contactId, newRole) => {
        try {
            const updatedContact = await updateContactRole(contactId, newRole);
            setContacts((prev) =>
                prev.map((contact) => contact.id === contactId ? updatedContact : contact)
            );
            setFilteredContacts((prev) =>
                prev.map((contact) => contact.id === contactId ? updatedContact : contact)
            );
        } catch (error) {
            console.error('Error updating contact role:', error);
        }
        setPopup({ type: "success", message:`The role of the contact has been updated to ${newRole}.`, show: true });
    };

    //Delete Function
    const handleDeletePopup = async (contactId) => {
        setContactIdToDelete(contactId);
        setShowPopup(true);
      };

    const cancelDelete = () => {setShowPopup(false);};
    const handleContactDelete = async () => {
        try {
            await deleteContact(contactIdToDelete);
            setContacts((prev) => prev.filter((contact) => contact.id !== contactIdToDelete));
            setFilteredContacts((prev) => prev.filter((contact) => contact.id !== contactIdToDelete));
            setPopup({ type: "success", message:'Contact Has been Deleted..', show: true });
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
        setShowPopup(false);
    };


    //Filter Button Functionality
    const handleFilterChange = (selectedRole) => {
        setRoleFilter(selectedRole);
        if (selectedRole === '') {
            setFilteredContacts(contacts.filter((contact) => contact.restaurantName.toLowerCase().includes(searchQuery) || contact.name.toLowerCase().includes(searchQuery)
                || contact.email.toLowerCase().includes(searchQuery)));
        } else {
            setFilteredContacts(contacts.filter((contact) => (contact.role === selectedRole) && (contact.restaurantName.toLowerCase().includes(searchQuery) || contact.name.toLowerCase().includes(searchQuery)
                || contact.email.toLowerCase().includes(searchQuery))));
        }
        setCurrentPage(1);
    };
    //Pagination Implementation
    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(filteredContacts.length / contactsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const renderPagination = () => {
        const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn"  onClick={() => handlePagination('prev')} disabled={currentPage === 1} > Prev </button>
                <span className="pagination-info"> {currentPage} / {totalPages} </span>
                <button  className="pagination-btn"  onClick={() => handlePagination('next')}  disabled={currentPage === totalPages} > Next </button>
            </div>
        );
    };
    //Search Functionality
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = contacts.filter(
            (contact) => contact.restaurantName.toLowerCase().includes(query) || contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
        );
        setFilteredContacts(filtered);
        setCurrentPage(1);
    }

    return (
        
        <div className="container mt-4">
          {popup.show && (
                <PopUpComponent type={popup.type}  message={popup.message} onClose={() => setPopup({ ...popup, show: false })}  />
            )}
            <h3 className="text-center">List of Contacts</h3>
            <div className="container">
                <div className="container bg-dark p-3 d-flex justify-content-between">
                    <div className="text-start d-flex align-items-center">
                        {/* Search Functionality  */}
                        <div className="searchBox">
                            <input className="searchInput" value={searchQuery} onChange={handleSearch} type="text" name="" placeholder="Search something" />
                            <button className="searchButton" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <g clipPath="url(#clip0_2_17)">
                                        <g filter="url(#filter0_d_2_17)">
                                            <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path>
                                        </g>
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                            <feOffset dy="4"></feOffset>
                                            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                                            <feComposite in2="hardAlpha" operator="out"></feComposite>
                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
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
                                                <a className="dropdown-item dropdown-toggle" href="#">Roles</a>
                                                <ul className="dropdown-menu">
                                                    {roles.map((role) => (
                                                        <li key={role}>
                                                            <a className="dropdown-item" href="#" onClick={() => handleFilterChange(role)}>
                                                                {role}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                          </div>
                    </div>
                    <div className="text-end add-lead-Btn-style">
                        {/* Insert Contact Functionality  */}
                        <button className="noselect" data-bs-toggle="modal" data-bs-target="#addContactModal">
                            <span className="text">Add Contact</span>
                            <span className="icon">
                                <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"></svg>
                                <span className="buttonSpan">+</span>
                            </span>
                        </button>
                    </div>
                </div>
                {/* Display All Contacts  */}
                <table className="table mt-3 table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Restaurant ID</th>
                            <th>Restaurant Name</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { isLoading ? (<tr><td colSpan="9"><Loader /></td> </tr>)  : currentContacts.length===0 ? ( <tr><td><NoDataMessage/></td></tr>) :
                           (currentContacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{contact.restaurantId}</td>
                                <td>{contact.restaurantName}</td>
                                <td>{contact.email}</td>
                                <td>{contact.name}</td>
                                <td>{contact.phoneNumber}</td>
                                <td>
                                    <select className="form-select" value={contact.role}
                                        onChange={(e) => handleRoleChange(contact.id, e.target.value)} >
                                        {roles.map((role) => (
                                            <option key={role} value={role}> {role} </option>
                                        ))}
                                    </select>
                                </td>
                                <td> <button className="btn btn-success m-1" onClick={() => handleContactEdit(contact)} >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button className="btn btn-danger m-1" onClick={() => handleDeletePopup(contact.id)} >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
                {/* Pagination Functionality  */}
                {renderPagination()}
            </div>
            <ConfirmationPopup show={showPopup} onConfirm={handleContactDelete}  onCancel={cancelDelete}  message="Are you sure you want to delete this restaurant?"/>
          
            {/* Modal for Adding/Editing Contact */}
            <div  className="modal fade" id="addContactModal"  tabIndex="-1"  aria-labelledby="addContactModalLabel"  aria-hidden="true" ref={modalRef} data-bs-backdrop="static" data-bs-keyboard="false" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: '#9f0005' }}>
                            <h5 className="modal-title" id="addContactModalLabel" style={{ color: 'white' }}>
                                {editMode ? 'Edit Contact' : 'Add Contact'}
                            </h5>
                            <button  type="button"  className="btn-close"  data-bs-dismiss="modal"  aria-label="Close"  onClick={resetForm} ></button>
                        </div>
                         {/* Input Popup Box Functionality  */}
                        <div className="modal-body" style={{ backgroundColor: '#e8e8e8' }}>
                            <form onSubmit={handleContactSubmit}>
                                <div className="coolinput mb-3">
                                    <label htmlFor="contactEmail" className="text form-label">
                                        Email
                                    </label>
                                    <input type="email"  className="input form-control" id="contactEmail"
                                        value={contactEmail}
                                        onChange={(e) => handleInputChange(e,"contactEmail")}
                                        placeholder="Enter Email"  required />
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="contactName" className="text form-label">
                                        Name
                                    </label>
                                    <input type="text" className="input form-control"
                                        id="contactName" value={contactName}
                                        onChange={(e) => handleInputChange(e,"contactName")}
                                        placeholder="Enter Name" required />
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="contactPhoneNumber" className="form-label">
                                        Contact Number
                                    </label>
                                    <input  type="tel" className=" input form-control"
                                        id="contactPhoneNumber" value={contactPhoneNumber}
                                        onChange={(e) => handleInputChange(e,"contactPhoneNumber")}
                                        placeholder="Enter Contact Number" required />
                                </div>
                                <div className="mb-3" style={{ color: '#818CF8', fontSize: ' 0.75rem', fontWeight: '700' }}>
                                    <label htmlFor="contactRole" className="text form-label">
                                        Role
                                    </label>
                                    <div className="radio-input-lead">
                                        {roles.map((role) => (
                                            <div key={role}>
                                                <input  type="radio"  id={role}
                                                    name="contactRole" value={role}
                                                    checked={contactRole === role}
                                                    onChange={() => setContactRole(role)}  required  />
                                                <label htmlFor={role}>{role}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="coolinput mb-3">
                                    <label htmlFor="contactRestaurantId" className="text form-label">
                                        Select Restaurant
                                    </label>
                                    <select className=" form-select" id="contactRestaurantId"
                                        value={contactRestaurantId}
                                        onChange={(e) => setContactRestaurantId(e.target.value)}  required >
                                        <option value="">Select Restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant.id} value={restaurant.id}>  {restaurant.restaurantName} </option>
                                        ))} 
                                    </select>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-success">
                                        {editMode ? 'Update' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
