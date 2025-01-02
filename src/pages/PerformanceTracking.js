import React, { useEffect, useState } from 'react'
import '../assets/css/style.css';
import { getUnderPerformingRestaurants, getWellPerformingRestaurants } from '../services/restaurantApiService';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart } from '@mui/x-charts';
ChartJS.register(ArcElement, Tooltip, Legend);
export default function PerformanceTracking() {

    const [wellPerformingRestaurants, setWellPerformingRestaurants] = useState([]);
    const [underPerformingRestaurants, setUnderPerformingRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurantsPerPage] = useState(4);

    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(wellPerformingRestaurants.length / restaurantsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
   
    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const currentWellPerformingRestaurants = wellPerformingRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const currentUnderPerformingRestaurants = underPerformingRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const renderPagination = (restaurants) => {
        const totalPages = Math.ceil(restaurants.length / restaurantsPerPage);
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn" onClick={() => handlePagination('prev')} disabled={currentPage === 1} >  Prev </button>
                <span className="pagination-info">  {currentPage} / {totalPages} </span>
                <button className="pagination-btn" onClick={() => handlePagination('next')} disabled={currentPage === totalPages} >  Next </button>
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const wellPerformingfData = await getWellPerformingRestaurants();
                setWellPerformingRestaurants(wellPerformingfData);
                console.log(wellPerformingRestaurants)
                const underPerformingfData = await getUnderPerformingRestaurants();
                setUnderPerformingRestaurants(underPerformingfData);
            }
            catch (error) { console.error("Failed to fetch restaurants:", error); }
        }
        fetchData();

    }, []);

    return (
        <>
            <div className='container main-container'>
                <section className='first-container'>
                    <h4 className='text-center'>Well-Performing Restaurants</h4>
                    <div className='container '>
                        <div className='table-container'>
                                <table className="table mt-1  table-striped table-hover" >
                                    <thead >
                                        <tr className='table-dark'>
                                            <th>ID</th>
                                            <th>Restaurant Name</th>
                                            <th>Orders in Last Month</th>
                                            <th>Last Interaction Date</th>
                                            <th>Assigned KAM</th>
                                            <th>Call Frequency</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentWellPerformingRestaurants.map((restaurant) => (
                                            <tr key={restaurant.id}>
                                                <th scope="row">{restaurant.id}</th>
                                                <td>{restaurant.restaurantName}</td>
                                                <td>{restaurant.orderCountLastMonth}</td>
                                                <td>{restaurant.lastCallDate}</td>
                                                <td>{restaurant.assignedKam}</td>
                                                <td>{restaurant.callFrequency}</td>
                                                <td>{restaurant.currentStatus}</td>
                                            </tr>
                                        ))}
                                   
                                    </tbody>
                                </table>
                        </div>
                        <div className='pagination-container'>
                                    {/* Pagination Functionality  */}
                                    {renderPagination(wellPerformingRestaurants)}
                        </div>
                       
                  
                    </div>
                </section>
                <section className="second-container">
                    
                    <div className='table-container-2'> 
                                <h4 className='text-center header-text'>Under-Performing Restaurants</h4>
                                <table className="table mt-1  table-striped table-hover" >
                                    <thead >
                                        <tr className='table-dark'>
                                            <th>Restaurant Name</th>
                                            <th>Orders in Last Month</th>
                                            <th>Last Interaction Date</th>
                                            <th>Assigned KAM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUnderPerformingRestaurants.map((restaurant) => (
                                            <tr key={restaurant.id}>
                                                <td>{restaurant.restaurantName}</td>
                                                <td>{restaurant.orderCountLastMonth}</td>
                                                <td>{restaurant.lastCallDate}</td>
                                                <td>{restaurant.assignedKam}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='pagination-container'>
                                    {/* Pagination Functionality  */}
                                    {renderPagination(underPerformingRestaurants)}
                                </div>
                    </div>   
                    <div className='piechart-container'>
                            <h5 className="text-start">Performance Comparison</h5>
                            <PieChart
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: wellPerformingRestaurants.length, label: 'Well-Performing' ,color: 'green' },
                                        { id: 1, value: underPerformingRestaurants.length, label: 'Under-Performing' ,color: 'red' },
                                    ],
                                    },
                                ]}
                                width={500}
                                height={300}
                                 />
                    </div>                 
                </section>

            </div>
        </>
    )
}
