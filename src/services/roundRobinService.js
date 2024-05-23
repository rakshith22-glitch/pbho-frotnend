// frontend/src/services/roundRobinService.js
import axios from 'axios';

const API_URL = 'https://pbho-backend.onrender.com/api/round-robin/';

export const getRoundRobins = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getRoundRobin = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const response = await axios.get(`${API_URL}${id}`, config);
    if (response.status !== 200) {
        throw new Error('Failed to fetch round robin details.');
    }
    return response.data;
};

export const createRoundRobin = async (roundRobin) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const response = await axios.post(API_URL, roundRobin, config);
    return response.data;
};

export const updateRoundRobin = async (id, roundRobin) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const response = await axios.put(`${API_URL}${id}`, roundRobin, config);
    return response.data;
};

export const deleteRoundRobin = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const response = await axios.delete(`${API_URL}${id}`, config);
    return response.data;
};
