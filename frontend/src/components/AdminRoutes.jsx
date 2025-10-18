import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../pages/admin/AdminLayout'; 
import AdminDashboardScreen from '../pages/admin/AdminDashboard';
import AdminProductApprovalScreen from '../pages/admin/ProductApprovalScreen';
import AdminActiveProductsScreen from '../pages/admin/ProductManagementScreen';
import AdminComplaintsScreen from '../pages/admin/AdminComplaintScreen';
import AdminComplaintDetailScreen from '../pages/admin/AdminComplaintDetailScreen';
import AdminUserListScreen from '../pages/admin/AdminUserListScreen';
import AdminComplaintHistoryScreen from '../pages/admin/AdminComplaintHistoryScreen';

const AdminRoute = ({ onLogout }) => {
  return (
    <AdminLayout onLogout={onLogout}>
      <Routes>
        <Route path="dashboard" element={<AdminDashboardScreen />} />
        <Route path="approvals" element={<AdminProductApprovalScreen />} />
        <Route path="products" element={<AdminActiveProductsScreen />} />
        <Route path="complaints" element={<AdminComplaintsScreen />} />
        <Route path="complaints/history" element={<AdminComplaintHistoryScreen />} /> {/* TAMBAHKAN BARIS INI */}
        <Route path="complaints/:id" element={<AdminComplaintDetailScreen />} />
        <Route path="users" element={<AdminUserListScreen />} />
        
        <Route path="/" element={<Navigate to="dashboard" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoute;