export const handleError = (error) => {
    if (error.response) {
        // Server responded with a status other than 200 range
        console.error(`Error (${error.response.status}):`, error.response.data.message || error.response.data);
        throw new Error(error.response.data.message || "An error occurred while processing your request.");
    } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        throw new Error("No response from server. Please check your network.");
    } else {
        // Something else caused the error
        console.error("Error in request setup:", error.message);
        throw new Error(error.message || "An unexpected error occurred.");
    }
};