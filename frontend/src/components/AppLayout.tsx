import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { getUser, type User } from "../utils/auth";
import LoginModal from "./LoginModal";

export const AppLayout: React.FC = () => {
  const [user, setUserState] = useState<User | null>(getUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUserState(getUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header 
          user={user} 
          onLoginClick={() => setIsLoginModalOpen(true)} 
        />
        
        <Outlet />
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};
