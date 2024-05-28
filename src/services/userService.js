import axios from 'axios';

// const API_URL = 'https://pbho-backend.onrender.com/api/users/';
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

export const getUserDetails = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}${userId}`);
        return response.data;
    } catch (error) {
        throw error;
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

export const getAllUsers = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
        throw new Error('Authentication token is missing.');
    }
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    try {
        const response = await axios.get(`${API_URL}`, config);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch all users:', error);
        // More detailed error handling based on status code
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                throw new Error('Unauthorized access. Please log in again.');
            }
            // Other status codes can be handled here
        }
        throw new Error('Failed to fetch all users. Please try again later.');
    }
};

// Search for users (used in admin user search for adding)
export const searchUsers = async (searchTerm) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const response = await axios.get(`${API_URL}search/${encodeURIComponent(searchTerm)}`, config);
    if (response.status !== 200) {
        throw new Error('Failed to search users.');
    }
    return response.data;
};