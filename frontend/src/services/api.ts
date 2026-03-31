import axios from 'axios';
import type { OrderStatus, OrdersResponse } from '../types/order';
import type { Product } from '../schemas/product.schema';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const getOrders = async (params: { page: number; limit: number; status: OrderStatus }): Promise<OrdersResponse> => {
  const response = await apiClient.get('/orders', {
    params,
  });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/products/id/${id}`);
  return response.data;
};

export const createOrder = async (payload: any, idempotencyKey: string): Promise<any> => {
  const response = await apiClient.post('/orders', payload, {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
  });
  return response.data;
};
