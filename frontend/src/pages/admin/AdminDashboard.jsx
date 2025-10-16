import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios'; 
import Button from '../../components/Button'; 

const AdminDashboardScreen = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/admin/transactions/pending', config);
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchPendingTransactions();
    } else {
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);
  const handleVerify = async (transactionId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this transaction?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await api.put(`/admin/transactions/${transactionId}/verify`, { action }, config);

        setTransactions(prevTransactions =>
          prevTransactions.filter(tx => tx._id !== transactionId)
        );
        alert(`Transaction successfully ${action}d!`);
      } catch (err) {
        alert(`Failed to ${action} transaction.`);
        setError(err.response?.data?.message);
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
           <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700">
              Logout
           </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Link to="/admin/dashboard" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
            Transaction Verification
          </Link>
          <Link to="/admin/approvals" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
            Product Approval
          </Link>
          <Link to="/admin/products" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
            Active Products
          </Link>
          <Link to="/admin/complaints" className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
            Complaint Center
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Pending Transactions</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
            {transactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proof</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tx.product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tx.buyer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-400 font-semibold">
                        Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href={`http://localhost:5000/${tx.paymentProof}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          View Proof
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button onClick={() => handleVerify(tx._id, 'approve')} className="bg-green-600 hover:bg-green-700 text-xs">
                          Approve
                        </Button>
                        <Button onClick={() => handleVerify(tx._id, 'reject')} className="bg-red-600 hover:bg-red-700 text-xs">
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-400">No transactions are waiting for confirmation.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardScreen;