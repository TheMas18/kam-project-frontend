import React, { useEffect, useState } from 'react'
import { countOfAllRecords, getAllPendingFollowUps, getTotalRestaurantStatus } from '../services/restaurantApiService';
import '../assets/css/style.css';
import '../assets/css/dashboard.css';
import { PieChart } from '@mui/x-charts';

export default function HomePage() {
  const [totalRecords,setTotalRecords]= useState({
    totalRestaurants: 0,
    totalContacts: 0,
    totalInteractions: 0,
    totalOrders: 0,
    pendingFollowUps:[],
    activeRestaurants:0,
    inActiveRestaurants:0,
  });
const [currentPage, setCurrentPage] = useState(1);// for pagination
const [restaurantsPerPage] =useState(10);// for pagination
  useEffect(()=>{
    const fetchData=async()=>{
      const countOfRecords = await countOfAllRecords();
      console.log("Fetched records:", countOfRecords); 
      if (countOfRecords) {
        setTotalRecords((prev) => ({ ...prev, ...countOfRecords }));
      }
      const pendingRecords = await getAllPendingFollowUps();
      console.log("Pending records:", pendingRecords); 
      if (pendingRecords) {
        setTotalRecords((prev) => ({ ...prev, pendingFollowUps: pendingRecords }));
      }

      const totalStatus=await getTotalRestaurantStatus();
      if (totalStatus) {
        setTotalRecords((prev) => ({
          ...prev,
          activeRestaurants: totalStatus.active,
          inActiveRestaurants: totalStatus.inactive,
        }));
      }

    }
    fetchData();
  },[]);
//Pagination Implementation
const handlePagination = (direction) => {
  if (direction === 'next' && currentPage < Math.ceil(totalRecords.pendingFollowUps.length / restaurantsPerPage)) {
      setCurrentPage(currentPage + 1);
  } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
  }
};

const indexOfLastRestaurant = currentPage * restaurantsPerPage;
const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
const currentRestaurants = totalRecords.pendingFollowUps.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
const renderPagination = () => {
  const totalPages = Math.ceil(totalRecords.pendingFollowUps.length / restaurantsPerPage);
  return (
      <div className="pagination-container text-end">
          <button className="pagination-btn"  onClick={() => handlePagination('prev')}  disabled={currentPage === 1} >  Prev </button>
          <span className="pagination-info">  {currentPage} / {totalPages} </span>
          <button className="pagination-btn" onClick={() => handlePagination('next')}  disabled={currentPage === totalPages} >  Next </button>
      </div>
  );
};

  return (
    <>
      <div className='cards-container'>
          <div className='cards'>
            <i className="fa-solid fa-utensils" style={{backgroundColor:'#4764f3'}}/>
            <div>
              <h3>{totalRecords.totalRestaurants}</h3>
              <span>Restaurants</span>
            </div>
          </div>
          <div className='cards'>
            <i className="fa-solid fa-address-book" style={{backgroundColor:'#f6ff00'}}/>
            <div>
              <h3>{totalRecords.totalContacts}</h3>
              <span>Contacts</span>
            </div>
          </div>
          <div className='cards'>
            <i className="fa-solid fa-comments" style={{backgroundColor:'#ff00dd'}}/>
            <div>
              <h3>{totalRecords.totalInteractions}</h3>
              <span>Interactions</span>
            </div>
          </div>
          <div className='cards'>
          <i className="fa-brands fa-first-order " style={{backgroundColor:'#47e911'}}></i>
            <div>
              <h3>{totalRecords.totalOrders}</h3>
              <span>Orders</span>
            </div>
          </div>
      </div>
      <div className='showcase'>
          <div className='container-table'>
              <h2>Pending Follow-Ups </h2>
               <table className="table mt-3  table-striped table-hover" >
                  <thead>
                        <tr className='table-dark'>
                            <th>ID</th>
                            <th>Restaurant Name</th>
                            <th>Contact Number</th>
                
                            <th>Last-Call-Date</th>
                            <th>Assigned KAM</th>
                        </tr>
                  </thead>
                  <tbody>
                        {totalRecords.pendingFollowUps.map((type) =>(
                          <tr key={type.id}>
                                  <td>{type.id}</td>
                                  <td>{type.restaurantName}</td>
                                  <td>{type.contactNumber}</td>
        
                                  <td>{type.lastCallDate}</td>
                                  <td>{type.assignedKam}</td>
                                </tr>
                        ))}
                        {totalRecords.pendingFollowUps.map((type) =>(
                          <tr key={type.id}>
                                  <td>{type.id}</td>
                                  <td>{type.restaurantName}</td>
                                  <td>{type.contactNumber}</td>
                              
                                  <td>{type.lastCallDate}</td>
                                  <td>{type.assignedKam}</td>
                                </tr>
                        ))}
                    
                    
                    
                    </tbody>
               </table>
               {renderPagination()}
          </div>
        <div className='container-chart'> 
                <div className='piechart-container'>
                            <h5 className="text-start">Restaurants Inactive and Active Status</h5>
                            <PieChart
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: totalRecords.activeRestaurants, label: 'Active' ,color: 'green' },
                                        { id: 1, value: totalRecords.inActiveRestaurants, label: 'InActive' ,color: 'red' },
                                    ],
                                    },
                                ]}
                                width={500}
                                height={300}
                                 />
                    </div>
        </div>
      </div>
    </>
  )
}
