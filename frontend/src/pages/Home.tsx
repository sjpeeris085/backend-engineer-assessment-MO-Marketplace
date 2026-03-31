import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import { ProductCard } from "../components/ProductCard";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";

export const Home: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Debounce search query so API is not spammed on every keystroke
  const debouncedSearch = useDebounce(searchQuery, 500);

  // When debounced search changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { products, meta, isLoading, error } = useProducts(
    page,
    10,
    debouncedSearch,
  );

  return (
    <>
      <header className="mb-10 mt-8 text-center pt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Discover Our Products
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our latest collection with elegant design and amazing
          quality.
        </p>
      </header>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 mb-12 place-items-stretch">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {meta && (
              <Pagination
                currentPage={meta.page}
                lastPage={meta.lastPage || 1}
                onPageChange={setPage}
                disabled={isLoading}
              />
            )}
          </>
        ) : !error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-gray-500">
              We couldn't find anything matching your search query.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : null}
    </>
  );
};
