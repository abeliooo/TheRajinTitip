import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MainLayout = ({ children, userInfo, onLogout }) => {
  const [isSellDropdownOpen, setIsSellDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link to="/home">
          <h1 className="text-2xl font-bold text-orange-500">The Rajin Titip</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/history" className="text-gray-300 hover:text-white font-bold py-2 px-4 rounded-lg">
            History
          </Link>
          <span className="border-r border-gray-600 h-6"></span>

          <div className="relative">
            <button
              onClick={() => setIsSellDropdownOpen(!isSellDropdownOpen)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-10 w-10 flex items-center justify-center rounded-lg text-xl"
            >
              +
            </button>
            {isSellDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-20">
                <Link to="/sell" className="block px-4 py-2 text-sm text-white hover:bg-gray-600" onClick={() => setIsSellDropdownOpen(false)}>
                  Sell Item
                </Link>
                <Link to="/my-listings" className="block px-4 py-2 text-sm text-white hover:bg-gray-600" onClick={() => setIsSellDropdownOpen(false)}>
                  My Listings
                </Link>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold text-white ring-2 ring-gray-500 hover:ring-orange-400">
              {userInfo.username.charAt(0).toUpperCase()}
            </button>
            {isProfileDropdownOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-20">
                <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-600" onClick={() => setIsProfileDropdownOpen(false)}>
                  Profile
                </Link>
                <Link to="/chat" className="block px-4 py-2 text-sm text-white hover:bg-gray-600" onClick={() => setIsProfileDropdownOpen(false)}>
                  Chat
                </Link>
                <div className="border-t border-gray-600 my-1"></div>
                <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;