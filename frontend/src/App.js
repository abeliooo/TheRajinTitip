import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from './pages/HomeScreen';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
import ProductDetail from './components/ProductDetails';
import SellScreen from './pages/SellScreen';
import PaymentScreen from './pages/PaymentScreen';
import TransactionHistoryScreen from './pages/TransactionHistoryScreen';
import TransactionDetailScreen from './pages/TransactionDetailScreen';
import AdminRoute from './components/AdminRoutes';
import AdminLoginScreen from './pages/admin/AdminLoginScreen';
import MyListingsScreen from './pages/MyListingsScreen';
import ProfileScreen from './pages/ProfileScreen';
import ChatScreen from './pages/ChatScreen';
import MainLayout from './components/MainLayout';

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
        
        {userInfo && (
          <Route 
            path="/*" 
            element={
              <MainLayout userInfo={userInfo} onLogout={handleLogout}>
                <Routes>
                  <Route path="/home" element={<HomeScreen userInfo={userInfo} onLogout={handleLogout} />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/sell" element={<SellScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/history" element={<TransactionHistoryScreen />} />
                  <Route path="/transaction/:id" element={<TransactionDetailScreen />} />
                  <Route path="/my-listings" element={<MyListingsScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/chat" element={<ChatScreen />} />
                  <Route path="/chat/:id" element={<ChatScreen />} />
                  <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
              </MainLayout>
            } 
          />
        )}

        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route path="/admin/*" element={<AdminRoute onLogout={handleLogout} />} />
        
        {!userInfo && <Route path="/*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;