import axios from 'axios';
import { PaginatedResponseSchema, type PaginatedResponse } from '../schemas/product.schema';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };
  
  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  const response = await apiClient.get('/products', { params });
  
  // Validate using Zod at runtime
  const validatedData = PaginatedResponseSchema.parse(response.data);
  return validatedData;
};
