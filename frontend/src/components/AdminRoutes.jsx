import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoute from './AdminRoute'; 
import AdminDashboardScreen from '../pages/admin/AdminDashboard';
import ProductApprovalScreen from '../pages/admin/ProductApprovalScreen';
import ProductManagementScreen from '../pages/admin/ProductManagementScreen';

const AdminRoutes = ({ onLogout }) => {
  return (
    <Routes>
      <Route
        path="dashboard" 
        element={
          <AdminRoute> 
            <AdminDashboardScreen onLogout={onLogout} />
          </AdminRoute>
        } 
      />
      <Route
        path="approvals" 
        element={
          <AdminRoute> 
            <ProductApprovalScreen />
          </AdminRoute>
        } 
      />
      <Route
        path="products"
        element={<AdminRoute><ProductManagementScreen /></AdminRoute>}
      />
    </Routes>
  );
};

export default AdminRoutes;