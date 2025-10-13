import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo && userInfo.isAdmin) {
    return children;
  }

  return <Navigate to="/admin/login" />;
};

export default AdminRoute;