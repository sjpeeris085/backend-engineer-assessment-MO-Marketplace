import { apiClient } from "../services/api";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/users/login", {
    email,
    password,
  });

  return response.data;
};

export const saveFcmToken = async (userId: string, fcmToken: string) => {
  const response = await apiClient.post(`/users/${userId}/fcm-token`, {
    fcmToken,
  });

  return response.data;
};
