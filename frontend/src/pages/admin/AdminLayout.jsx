import React from 'react';
import AdminNav from './AdminNav';
import Button from '../../components/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleAdminLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userInfo');

      navigate('/admin/login');
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleAdminLogout} variant="danger">
            Logout
          </Button>
        </div>

        <AdminNav />

        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;