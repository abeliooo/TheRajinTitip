import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoute from './AdminRoute'; 
import AdminDashboardScreen from '../pages/admin/AdminDashboard';
import ProductApprovalScreen from '../pages/admin/ProductApprovalScreen';
import ProductManagementScreen from '../pages/admin/ProductManagementScreen';
import AdminComplaintsScreen from '../pages/admin/AdminComplaintScreen';
import AdminComplaintDetailScreen from '../pages/admin/AdminComplaintDetailScreen';

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
        element={
          <AdminRoute>
            <ProductManagementScreen />
          </AdminRoute>
        }
      />
      <Route 
        path="complaints" 
        element={
          <AdminRoute>
            <AdminComplaintsScreen onLogout={onLogout} />
          </AdminRoute>
        }
      />
      <Route 
      path="complaints/:id" 
      element={
        <AdminRoute>
          <AdminComplaintDetailScreen onLogout={onLogout} />
        </AdminRoute>
      }
      />
    </Routes>
  );
};

export default AdminRoutes;