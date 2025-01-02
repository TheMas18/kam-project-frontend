import axios from 'axios';

const API_URL = 'http://localhost:8080/contacts';

const handleError=(error)=>{
    console.error("Error fetching contacts:", error);
    throw error;
}
export const getContacts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const addContact = async (contact) => {
    try {
        
        console.log(contact);
        const response = await axios.post(API_URL, contact);
        console.log(response)
        return response.data;
      
    } catch (error) {
        handleError(error);
    }
};

export const updateContactRole = async (contactId, role) => {
    try {
        const response = await axios.put(`${API_URL}/${contactId}/role`, { role });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteContact=async(contactId)=>{
    try {
        const response=await axios.delete(`${API_URL}/${contactId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const updateContactDetails = async (contactId, updatedDetails) => {
 
    try {
        const response = await axios.put(`${API_URL}/${contactId}`, updatedDetails);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const getContactsByRestaurantId = async (restaurantId) => {
    try {
        const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
export const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/roles`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


