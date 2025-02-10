import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL

export const getOperatorData = async (
    satellite,
    pageNum,
    pageSize = 10,
    geo,
    cloudpercent,
    start_date,
    end_date,
    resolution,
    off_nadir,
    image_type,
    token) => {
    try {
        const response = await axios.get(`${api_url}/satellite`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            params: {
                satellite,
                pageNum,
                pageSize,
                geo,
                cloudpercent,
                start_date,
                end_date,
                resolution,
                off_nadir,
                image_type
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error); 
        throw new Error(error.response ? error.response.data : "Failed to fetch Jilin data");
    }
}

export const createOrder = async (token, formData) => {
    try {
        console.log(formData)
        const response = await axios.post(`${api_url}/orders/`, formData, {
            headers: {
                // "Content-Type": "multipart/form-data",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch create order");
    }
}

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

export const getOrderDetails = async (token, orderId) => {
    try {
        const response = await axios.get(`${api_url}/orders/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch order details");
    }
}

export const addAdminComment = async (token , id, comment) => {
    try {
        const response = await axios.post(`${api_url}/orders/${id}/comments`,comment, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data: "Failed to add comment");
    }
}
export const addImageryLink = async (token, id, link) => {
    try {
        const response = await axios.patch(`${api_url}/orders/${id}/image_url`, link, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data: "Failed to add image link");
    }
}
