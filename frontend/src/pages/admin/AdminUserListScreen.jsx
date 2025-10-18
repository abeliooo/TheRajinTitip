import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminUserListScreen = ({ onLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await api.get('/admin/users', config);
        
        setAdmins(data.filter(user => user.isAdmin));
        setRegularUsers(data.filter(user => !user.isAdmin));

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const renderUserTable = (users, title) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">{title} ({users.length})</h3>
      <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
        {users.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500">No users in this category.</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          {renderUserTable(admins, 'Administrators')}
          {renderUserTable(regularUsers, 'Regular Users')}
        </>
      )}
    </div>
  );
};

export default AdminUserListScreen;