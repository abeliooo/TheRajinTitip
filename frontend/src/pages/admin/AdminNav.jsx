import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const activeClass = 'bg-orange-600';
  const inactiveClass = 'bg-gray-700 hover:bg-gray-600';

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Link 
        to="/admin/dashboard" 
        className={`text-white font-bold py-2 px-4 rounded-lg ${location.pathname.includes('dashboard') ? activeClass : inactiveClass}`}
      >
        Transaction Verification
      </Link>
      <Link 
        to="/admin/approvals" 
        className={`text-white font-bold py-2 px-4 rounded-lg ${location.pathname.includes('approvals') ? activeClass : inactiveClass}`}
      >
        Product Approval
      </Link>
      <Link 
        to="/admin/products" 
        className={`text-white font-bold py-2 px-4 rounded-lg ${location.pathname.includes('products') ? activeClass : inactiveClass}`}
      >
        Active Products
      </Link>
      <Link 
        to="/admin/complaints" 
        className={`text-white font-bold py-2 px-4 rounded-lg ${location.pathname.includes('complaints') ? activeClass : inactiveClass}`}
      >
        Complaint Center
      </Link>
      <Link 
        to="/admin/users" 
        className={`text-white font-bold py-2 px-4 rounded-lg ${location.pathname.includes('users') ? activeClass : inactiveClass}`}
      >
        User Management
      </Link>
    </div>
  );
};

export default AdminNav;