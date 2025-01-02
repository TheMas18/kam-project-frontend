import React, { useEffect, useRef, useState } from 'react'
import { getRestaurantsRequiringCallsToday, updateLastCallDate } from '../services/restaurantApiService';
import { getAllCallFrequency } from '../services/restaurantApiService';
import { useNavigate } from 'react-router-dom';
import ConfirmationPopup from '../components/ConfirmationPopup';
import PopUpComponent from '../components/PopUpComponent';


export default function CallPlanning() {
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurantsPerPage] =useState(7);// for pagination
    const [restaurantsCallRequired, setRestaurantsCallRequired] = useState([]);
    const [popup, setPopup] = useState({ type: "", message: "", show: false });//popup functionality
    const [showPopup, setShowPopup] = useState(false);
    const [restaurantToUpdate, setRestaurantToUpdate] = useState(null);
    useEffect(() => {
        const fetchData=async()=>{
            try {
                const restaurantData = await getRestaurantsRequiringCallsToday();
                setRestaurantsCallRequired(restaurantData);
            }   
            catch (error) {console.error("Failed to fetch restaurants:", error);} 
        }
        fetchData();
    }, []);

    const navigate = useNavigate();

    const handleCompleteCall = async () => {
        const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format   
        try {
          const updatedCall=await updateLastCallDate(restaurantToUpdate, today);
          setPopup({ type: "success", message:'Call is completed', show: true });
          console.log(updatedCall)
          setTimeout(() => {
              navigate(`/interactions?restaurantId=${restaurantToUpdate}`);
          }, 1000);
        } catch (error) {console.error("Error Updating Call", error);}
        setShowPopup(false);
      };

      const handlePopUp = async (restaurantId) => {
        setRestaurantToUpdate(restaurantId);
        setShowPopup(true);
      };

      const cancelUpdate = () => {setShowPopup(false);};

         //Pagination Implementation
    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(restaurantsCallRequired.length / restaurantsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const currentRestaurants = restaurantsCallRequired.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const renderPagination = () => {
        const totalPages = Math.ceil(restaurantsCallRequired.length / restaurantsPerPage);
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn"  onClick={() => handlePagination('prev')}  disabled={currentPage === 1} >  Prev </button>
                <span className="pagination-info">  {currentPage} / {totalPages} </span>
                <button className="pagination-btn" onClick={() => handlePagination('next')}  disabled={currentPage === totalPages} >  Next </button>
            </div>
        );
    };
  return (
    <div className="container mt-4">
            <h3 className='text-center'>List of Restaurants Requiring Calls Today</h3>
            {popup.show && (
                <PopUpComponent
                    type={popup.type}
                    message={popup.message}
                    onClose={() => setPopup({ ...popup, show: false })}
                />
            )}
            <ConfirmationPopup show={showPopup} onConfirm={handleCompleteCall}  onCancel={cancelUpdate}  message="Are you sure you have completed the call? Click 'Yes' to confirm."/>  
            <div className='container '>
                 {/* Display All Leads  */}
                <table className="table mt-1  table-striped table-hover" >
                    <thead >
                        <tr className='table-dark'>
                        <th scope="col">ID</th>
                        <th scope="col">Restaurant Name</th>
                        <th scope="col">Assigned KAM</th>
                        <th scope="col">Last Call Date</th>
                        <th scope="col">Call Frequency</th>
                        <th scope="col" >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantsCallRequired.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <th scope="row">{restaurant.id}</th>
                                <td>{restaurant.restaurantName}</td>
                                <td>{restaurant.assignedKam}</td>
                                <td>{restaurant.lastCallDate}</td>
                                <td>{restaurant.callFrequency} </td>
                                <td> <button onClick={() => handlePopUp(restaurant.id)} className="btn btn-success">  Complete Call  </button> </td>         
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {/* Pagination Functionality  */}
                {renderPagination()}       
            </div>
        </div>
  )
}
