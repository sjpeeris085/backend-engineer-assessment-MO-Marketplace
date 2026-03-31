import React from 'react';
import { type Product } from '../schemas/product.schema';
import { formatCurrency } from '../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center shrink-0">
        <span className="text-gray-500">Image</span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3 w-fit">
          {product.model}
        </span>
        <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
