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
                end_date
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