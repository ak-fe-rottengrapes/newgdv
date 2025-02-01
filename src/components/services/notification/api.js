import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL

export const getNotification = async (token) => {
    try {
        // console.log(token)
        const response = await axios.get(`${api_url}/notifications`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch notification list");
    }
};

