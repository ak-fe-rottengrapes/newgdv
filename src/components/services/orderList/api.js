import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL

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
        throw new Error(error.response ? error.response.data.detail : "Failed to fetch order list");
    }
}

export const deleteOrder = async (token, id) => {
    try {
        const response = await axios.delete(`${api_url}/orders/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data.detail : "Failed to delete order");
    }
}