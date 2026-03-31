import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getCart } from "../utils/cart";

import { type User, removeUser } from "../utils/auth";

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

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
        <div 
          onClick={() => navigate('/cart')}
          className="cursor-pointer flex items-center hover:bg-gray-50 p-2 rounded-full transition-colors mr-2"
          title="Cart"
        >
          <Badge count={cartCount} offset={[-2, 6]}>
            <ShoppingCartOutlined className="text-2xl text-gray-700 hover:text-indigo-600 transition-colors" />
          </Badge>
        </div>

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
