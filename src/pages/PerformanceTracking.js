import React, { useEffect, useState } from 'react'
import {getUnderPerformingRestaurants, getWellPerformingRestaurants } from '../services/restaurantApiService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart } from '@mui/x-charts';
import { Loader, NoDataMessage } from '../components/utils';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PerformanceTracking() {

    //all the data obj fields
    const [wellPerformingRestaurants, setWellPerformingRestaurants] = useState([]);
    const [underPerformingRestaurants, setUnderPerformingRestaurants] = useState([]);
    const [currentPageWell, setCurrentPageWell] = useState(1); // for pagination 
    const [currentPageUnder, setCurrentPageUnder] = useState(1); // for pagination
    const [restaurantsPerPage] = useState(4);// for pagination
    const [isLoading, setIsLoading] = useState(true); //loading functionality

    //pagination functionality
    const handlePagination = (direction, table) => {
        if (table === 'well') {
            if (direction === 'next' && currentPageWell < Math.ceil(wellPerformingRestaurants.length / restaurantsPerPage)) {
                setCurrentPageWell(currentPageWell + 1);
            } else if (direction === 'prev' && currentPageWell > 1) {
                setCurrentPageWell(currentPageWell - 1);
            }
        } else if (table === 'under') {
            if (direction === 'next' && currentPageUnder < Math.ceil(underPerformingRestaurants.length / restaurantsPerPage)) {
                setCurrentPageUnder(currentPageUnder + 1);
            } else if (direction === 'prev' && currentPageUnder > 1) {
                setCurrentPageUnder(currentPageUnder - 1);
            }
        }
    };
   
    const indexOfLastRestaurantWell = currentPageWell * restaurantsPerPage;
    const indexOfFirstRestaurantWell = indexOfLastRestaurantWell - restaurantsPerPage;
    const currentWellPerformingRestaurants = wellPerformingRestaurants.slice(indexOfFirstRestaurantWell, indexOfLastRestaurantWell);

    const indexOfLastRestaurantUnder = currentPageUnder * restaurantsPerPage;
    const indexOfFirstRestaurantUnder = indexOfLastRestaurantUnder - restaurantsPerPage;
    const currentUnderPerformingRestaurants = underPerformingRestaurants.slice(indexOfFirstRestaurantUnder, indexOfLastRestaurantUnder);

    const renderPagination = (restaurants, table) => {
        const totalPages = Math.ceil(restaurants.length / restaurantsPerPage);
        const currentPage = table === 'well' ? currentPageWell : currentPageUnder;
        return (
            <div className="pagination-container text-end">
                <button className="pagination-btn" onClick={() => handlePagination('prev', table)} disabled={currentPage === 1}>
                    Prev
                </button>
                <span className="pagination-info">
                    {currentPage} / {totalPages}
                </span>
                <button className="pagination-btn" onClick={() => handlePagination('next', table)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const wellPerformingfData = await getWellPerformingRestaurants();
                setWellPerformingRestaurants(wellPerformingfData);
                console.log(wellPerformingRestaurants)
                const underPerformingfData = await getUnderPerformingRestaurants();
                setUnderPerformingRestaurants(underPerformingfData);
                // const countLastMonthInteraction=await getInteractionCountLastMonth();
                // console.log(countLastMonthInteraction)
                // const countLastMonthOrder=await getOrderCountLastMonth();
                // console.log(countLastMonthOrder)
            }
            catch (error) { console.error("Failed to fetch restaurants:", error); }
            finally { setIsLoading(false);  }
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
                                            <th>Interactions in Last Month</th>
                                            <th>Last Interaction Date</th>
                                            <th>Assigned KAM</th>
                                            <th>Call Frequency</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (<tr><td colSpan="9"><Loader /></td> </tr>)  : currentWellPerformingRestaurants.length===0 ? ( <tr><td><NoDataMessage/></td></tr>) :
                                                                   (currentWellPerformingRestaurants.map((restaurant) => (
                                            <tr key={restaurant.id}>
                                                <th scope="row">{restaurant.id}</th>
                                                <td>{restaurant.restaurantName}</td>
                                                <td>{restaurant.orderCountLastMonth}</td>
                                                <td>{restaurant.interactionCountLastMonth}</td>
                                                <td>{restaurant.lastCallDate}</td>
                                                <td>{restaurant.assignedKam}</td>
                                                <td>{restaurant.callFrequency}</td>
                                                <td>{restaurant.currentStatus}</td>
                                            </tr>
                                        )))}
                                   
                                    </tbody>
                                </table>
                        </div>
                        <div className='pagination-container'>
                                    {/* Pagination Functionality  */}
                                    {renderPagination(wellPerformingRestaurants, 'well')}
                        </div>
                       
                  
                    </div>
                </section>
                <div className="showcase">
                        <div className='container-table'>
                                <h2>Under-Performing Restaurants</h2>
                                <table className="table mt-1  table-striped table-hover" >
                                    <thead >
                                        <tr className='table-dark'>
                                            <th>Restaurant Name</th>
                                            <th>Orders in Last Month</th>
                                            <th>Interactions Last Month</th>
                                            <th>Last Interaction Date</th>
                                            <th>Assigned KAM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (<tr><td colSpan="9"><Loader /></td> </tr>)  : currentUnderPerformingRestaurants.length===0 ? ( <tr><td><NoDataMessage/></td></tr>) :
                                                 (currentUnderPerformingRestaurants.map((restaurant) => (
                                            <tr key={restaurant.id}>
                                                <td>{restaurant.restaurantName}</td>
                                                <td>{restaurant.orderCountLastMonth}</td>
                                                <td>{restaurant.interactionCountLastMonth}</td>
                                                <td>{restaurant.lastCallDate}</td>
                                                <td>{restaurant.assignedKam}</td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                                {renderPagination(underPerformingRestaurants, 'under')}
                         </div>   
                        <div className='container-chart'> 
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
                                        ]} width={600} height={300}  />
                            </div>  
                        </div>
           
                </div>
                                        
            </div>
        </>
    )
}
