import axios from 'axios';

const API_URL = 'http://localhost:8080/interactions';

const handleError = (error) => {
    console.error("Error fetching interactions:", error);
    throw error;
}
export const getInteractions = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
export const addInteraction = async (interaction) => {
    try {
        const response = await axios.post(API_URL, interaction);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getInteractionTypes = async () => {
    try {
        const response = await axios.get(`${API_URL}/interactionTypes`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const deleteInteraction = async (interactionId) => {
    try {
        const response = await axios.delete(`${API_URL}/${interactionId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const updateInteracitonType = async (interactionId, newType) => {
    try {
        const response = await axios.put(`${API_URL}/${interactionId}/interactionType`, { interactionType: newType });
        console.log("After response", response);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export const updateInteractionFollowUp = async (interactionId, followUpRequired) => {
    try {
        const response = await axios.put(`${API_URL}/${interactionId}/follow-up`, {followUpRequired});
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const updateInteractionDetails=async(interactionId,updatedDetails)=>{
    try {
        const response=await axios.put(`${API_URL}/${interactionId}`,updatedDetails);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}