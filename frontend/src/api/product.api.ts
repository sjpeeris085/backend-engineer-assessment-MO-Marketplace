import {
  PaginatedResponseSchema,
  type PaginatedResponse,
} from "../schemas/product.schema";
import { apiClient } from "../services/api";

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PaginatedResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search && search.trim() !== "") {
    params.search = search.trim();
  }

  const response = await apiClient.get("/products", { params });

  // Validate using Zod at runtime
  const validatedData = PaginatedResponseSchema.parse(response.data);
  return validatedData;
};
