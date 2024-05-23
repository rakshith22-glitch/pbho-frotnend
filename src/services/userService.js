import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const handleErrorResponse = (error) => {
    console.error('Error:', error.response ? error.response.data.message : error.message);
    throw new Error(error.response ? error.response.data.message : error.message);
};

export const register = async (name, email, password, userType = 'user', isMember = false) => {
    try {
        const response = await axios.post(`${API_URL}register`, { name, email, password, userType, isMember });
        if (response.data.token) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}login`, { email, password });
        if (response.data.token) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
    }
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getUserProfile = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) return null;

        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(`${API_URL}profile`, config);
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
    }
};

export const becomeMember = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.put(`${API_URL}become-member`, {}, config);
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
    }
};

export const cancelMembership = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.put(`${API_URL}cancel-membership`, {}, config);
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
    }
};
