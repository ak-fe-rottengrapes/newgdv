import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const addEmployee = async (token, data) => {
    try {
        const response = await axios.post(`${api_url}/sign-up`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : "Failed to fetch users list");
    }
};

export const getEmployeeList = async (token) => {
    try {
        const response = await axios.get(`${api_url}/users?role=employee`  ,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : "Failed to fetch users list");
    }
}

    export const DeleteMultipleEmployee = async (token, body) => {
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