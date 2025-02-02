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