import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  model: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

export type Product = z.infer<typeof ProductSchema>;

export const PaginatedResponseSchema = z.object({
  data: z.array(ProductSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    lastPage: z.number(),
  }),
});

export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
