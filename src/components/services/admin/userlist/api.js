import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const getUserList = async (token) => {
    try {
        const response = await axios.get(`${api_url}/users`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch users list");
    }
};

export const getUserDetails = async (token, userId) => {
    try {
        const response = await axios.get(`${api_url}/users/${userId}`, {
            headers: {
                "Content-Type": "appication/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to fetch user details");
    }
}

export const rejectUser = async(token, id) => {
    try {
        const response = await axios.delete(`${api_url}/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data: "Failed to reject user");
    }
}
export const DeleteMultipleUser = async (token, body) => {
    try {
        const response = await axios.delete(`${api_url}/multiple_users`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: body  
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : "Failed to reject user");
    }
};

export const aprroveUser = async (token, userId) => {
    try {
        const response = await axios.patch(`${api_url}/users/${userId}` ,{},{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {   
        throw new Error(error.response ? error.response.data : "Failed to approve user")
    }
}