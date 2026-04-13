import axios from 'axios';

const BASE_URL = 'https://investry.runasp.net/api';

export const createProject = async (formData) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(`${BASE_URL}/Projects/create-project`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
};