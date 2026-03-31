import React from "react";
import { useNavigate } from "react-router-dom";

import { type User, removeUser } from "../utils/auth";

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeUser();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
        <svg
          className="h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
        <span className="text-2xl font-bold text-gray-900">E-Shop</span>
      </div>

      <div className="flex-1 mx-4 hidden md:block" />

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700 font-medium hidden sm:block">Hello, {user.name || user.email.split('@')[0]}</span>
            {user.role === 'ADMIN' && (
              <button 
                onClick={() => navigate('/orders')}
                className="text-gray-600 hover:text-indigo-600 px-3 font-medium transition-colors cursor-pointer"
              >
                Orders
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={onLoginClick}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
