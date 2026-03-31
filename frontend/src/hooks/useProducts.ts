import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/product.api';
import { type Product, type PaginatedResponse } from '../schemas/product.schema';

interface UseProductsResult {
  products: Product[];
  meta: PaginatedResponse['meta'] | null;
  isLoading: boolean;
  error: string | null;
}

export const useProducts = (page: number, limit: number, search: string): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchProducts(page, limit, search);
        
        if (isMounted) {
          setProducts(response.data);
          setMeta(response.meta);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [page, limit, search]);

  return { products, meta, isLoading, error };
};
