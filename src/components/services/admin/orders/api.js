import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const getOrders = async (token) => {
    try {
        const response = await axios.get(`${api_url}/orders/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch order list");
    }
}

export const getEmployee = async (token) => {
    try {
        const response = await axios.get(`${api_url}/users`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            params: {
                role: "employee"
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error); 
        throw new Error(error.response ? error.response.data : "Failed to fetch employee name");
    }
}

export const assignEmployee = async (token, orderId, data) => {
    try {
        const response = await axios.patch(`${api_url}/orders/${orderId}/status`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to asign employee");
    }
}

export const rejectOrder = async (token, orderId, data) => {
    try {
        const response = await axios.patch(`${api_url}/orders/${orderId}/status`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to reject order");
    }
}