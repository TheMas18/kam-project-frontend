import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/restaurants`;

const handleError=(error)=>{
    console.error("Error fetching restaurants:", error);
    throw error;
}
export const getRestaurants = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
export const getRestaurantById = async (restaurantId) => {
    try {
        const response = await axios.get(`${API_URL}/${restaurantId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const addRestaurant = async (restaurant) => {
    try {
        const response = await axios.post(API_URL, restaurant);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateRestaurantStatus = async (restaurantId, status) => {
    try {
        const response = await axios.put(`${API_URL}/${restaurantId}/currentStatus`, { currentStatus: status });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
export const updateCallFrequencyChange = async (restaurantId, newCallFrequency) => {
    try {
        const response = await axios.put(`${API_URL}/${restaurantId}/callFrequency`, { callFrequency: newCallFrequency });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteRestaurant=async(restaurantId)=>{
    try {
        const response=await axios.delete(`${API_URL}/${restaurantId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const updateRestaurantDetails = async (restaurantId, updatedDetails) => {
    try {
        const response = await axios.put(`${API_URL}/${restaurantId}`, updatedDetails);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
export const getAllStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/allstatus`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getAllCallFrequency = async () => {
    try {
        const response = await axios.get(`${API_URL}/allCallFrequency`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getRestaurantsRequiringCallsToday = async () => {
    try {
        const response = await axios.get(`${API_URL}/requiringCalls`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateLastCallDate = async (restaurantId, lastCallDate) => {
    try {
      const response = await axios.put(`${API_URL}/${restaurantId}/callDetails`, { lastCallDate });
      return response.data; 
    } catch (error) {
        handleError(error);
    }
};


export const getWellPerformingRestaurants=async()=>{
    try {
        const response = await axios.get(`${API_URL}/wellPerforming`);
        console.log(response.data)
        return response.data;
        }catch (error) {
            handleError(error);
        }
  };

  
export const getUnderPerformingRestaurants=async()=>{
    try {
        const response = await axios.get(`${API_URL}/underPerforming`);
        return response.data;
        }catch (error) {
            handleError(error);
        }
  };


export const countOfAllRecords=async()=>{

    try {
        const response= await axios.get(`${API_URL}/counts`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export const getAllPendingFollowUps=async()=>{

    try {
        const response= await axios.get(`${API_URL}/pendingFollowUps`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export const getTotalRestaurantStatus=async()=>{

    try {
        const response= await axios.get(`${API_URL}/statusCounts`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}