import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from './pages/HomeScreen';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
import ProductDetail from './components/ProductDetails';
import SellScreen from './pages/SellScreen';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      localStorage.removeItem('userInfo'); 
    } finally {
      setLoading(false); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={userInfo ? <Navigate to="/home" /> : <LoginScreen setUserInfo={setUserInfo} />} />
        <Route path="/register" element={userInfo ? <Navigate to="/home" /> : <RegisterScreen />} />
        <Route path="/home" element={userInfo ? <HomeScreen userInfo={userInfo} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        
        <Route 
          path="/product/:id" 
          element={userInfo ? <ProductDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/sell" 
          element={userInfo ? <SellScreen /> : <Navigate to="/login" />} 
        />
        
        <Route path="/" element={<Navigate to={userInfo ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;