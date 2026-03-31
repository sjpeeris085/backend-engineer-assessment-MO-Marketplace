import React from 'react';

interface CategoryCardProps {
  title: string;
  imageUrl?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 overflow-hidden flex flex-col h-full">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-500">Image</span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
  );
};
