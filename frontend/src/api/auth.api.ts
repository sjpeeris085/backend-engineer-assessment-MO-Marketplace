import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (email: string, password: string) => {
  const response = await authApiClient.post('/users/login', {
    email,
    password,
  });
  
  return response.data;
};

export const saveFcmToken = async (userId: string, fcmToken: string) => {
  const response = await authApiClient.post(`/users/${userId}/fcm-token`, {
    fcmToken,
  });
  
  return response.data;
};
