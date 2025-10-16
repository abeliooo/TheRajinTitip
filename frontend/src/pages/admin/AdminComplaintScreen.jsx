import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';

const AdminComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/admin/complaints', config);
        setComplaints(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchComplaints();
    }
  }, [userInfo]);
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/dashboard" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
            &larr; Back
        </Link>
        <h2 className="text-2xl font-semibold mb-4">Complaint Management</h2>

        {loading ? (
          <p>Loading complaints...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
            {complaints.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Complaint Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {complaints.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tx.product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tx.buyer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tx.seller.username}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(tx.complaintDetails.filedAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/complaints/${tx._id}`}>
                            <Button className="bg-red-700 hover:bg-red-600 text-xs">
                            Review Details
                            </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-400">No active complaints.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsScreen;