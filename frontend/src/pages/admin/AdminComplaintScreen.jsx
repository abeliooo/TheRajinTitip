import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';

const AdminComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
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

    fetchComplaints();
  }, []);
  
 return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Active Complaints</h2>
        <Link to="/admin/complaints/history">
          <Button>View History</Button>
        </Link>
      </div>
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
                            <Button className="bg-blue-600 hover:bg-blue-700 text-xs">
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
  );
};

export default AdminComplaintsScreen;