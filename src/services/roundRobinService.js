// frontend/src/services/roundRobinService.js
import axios from "axios";

const API_URL = "https://pbho-backend.onrender.com/api/round-robin/";
// const API_URL = 'http://localhost:5000/api/round-robin/';// 

export const getRoundRobins = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getRoundRobin = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.get(`${API_URL}${id}`, config);
  if (response.status !== 200) {
    throw new Error("Failed to fetch round robin details.");
  }
  return response.data;
};

export const createRoundRobin = async (roundRobin) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(API_URL, roundRobin, config);
  return response.data;
};

export const updateRoundRobin = async (id, roundRobin) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.put(`${API_URL}${id}`, roundRobin, config);
  return response.data;
};

export const deleteRoundRobin = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.delete(`${API_URL}${id}`, config);
  return response.data;
};

export const joinRoundRobin = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(`${API_URL}${id}/join`, {}, config);
  if (response.status !== 200) {
    throw new Error("Failed to join round robin.");
  }
  return response.data;
};

export const joinWaitlist = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(`${API_URL}${id}/waitlist`, {}, config);
  if (response.status !== 200) {
    throw new Error("Failed to join waitlist.");
  }
  return response.data;
};

export const addUserToRoundRobin = async (roundRobinId, userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    throw new Error("User authentication required.");
  }
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  try {
    const response = await axios.post(
      `${API_URL}${roundRobinId}/add-user`,
      { userId },
      config
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to add user to round robin: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error adding user to round robin:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response
        ? error.response.data.message
        : "Failed to add user to round robin."
    );
  }
};

export const removeUserFromRoundRobin = async (roundRobinId, userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    throw new Error("User authentication required.");
  }
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  try {
    const response = await axios.post(
      `${API_URL}${roundRobinId}/remove-user`,
      { userId },
      config
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to remove user from round robin: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error removing user from round robin:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response
        ? error.response.data.message
        : "Failed to remove user from round robin."
    );
  }
};

export const sendJoinRequest = async (roundRobinId, userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  try {
    const response = await axios.post(
      `${API_URL}${roundRobinId}/join-request`,
      { userId },
      config
    );
    if (response.status !== 200) {
      throw new Error("Failed to send join request.");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error sending join request to round robin:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response
        ? error.response.data.message
        : "Failed to remove user from round robin."
    );
  }
};

// Approve a join request
export const approveJoinRequest = async (roundRobinId, userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(
    `${API_URL}${roundRobinId}/approve-request`,
    { userId },
    config
  );
  if (response.status !== 200) {
    throw new Error("Failed to approve join request.");
  }
  return response.data;
};

// Reject a join request
export const rejectJoinRequest = async (roundRobinId, userId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const response = await axios.post(
    `${API_URL}${roundRobinId}/reject-request`,
    { userId },
    config
  );
  if (response.status !== 200) {
    throw new Error("Failed to reject join request.");
  }
  return response.data;
};
