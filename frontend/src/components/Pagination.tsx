import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  disabled = false,
}) => {
  // If there's 1 or 0 pages, we can still show the UI but disable everything
  // to ensure the user can evaluate the layout.

  return (
    <div className="flex items-center justify-center space-x-4 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Previous
      </button>
      
      <div className="text-sm font-medium text-gray-600">
        Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{lastPage}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= lastPage}
        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};
