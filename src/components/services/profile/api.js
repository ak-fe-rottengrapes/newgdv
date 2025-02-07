import axios from "axios";


const api_url = process.env.NEXT_PUBLIC_API_URL

export const resetPassword = async (token,data) => {
    try {
        const response = await axios.patch(`${api_url}/profile/reset-password`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.email ? error.response.data.email  : error.response.data.new_password ? error.response.data.new_password : "Failed to reset password");
    }
}

export const SignUpUser = async (userData) => {
    try {
        const response = await axios.post(`${api_url}/sign-up`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        // throw new Error(error.response?.data?.error);
        throw error.response?.data?.error || "Unable to create profile";
        // throw new Error(error.response ? error.response?.data?.error : "Unable to create profile");
    }
}

export const completeProfile = async (profileData) => {
    try {
        const response = await axios.post(`${api_url}/profile/`, profileData, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            const errorDetail = error.response.data?.detail;
            throw new Error(errorDetail || "Failed to complete profile");
        }
        throw new Error("Failed to complete profile");
    }
}
