import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import Button from '../../components/Button'; 

const AdminDashboardScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await api.get('/admin/transactions/pending', config);
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingTransactions();
  }, []);
  
  const handleVerify = async (transactionId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this transaction?`)) {
      try {
        const { token } = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.put(`/admin/transactions/${transactionId}/verify`, { action }, config);

        setTransactions(prevTransactions =>
          prevTransactions.filter(tx => tx._id !== transactionId)
        );
        alert(`Transaction successfully ${action}d!`);
      } catch (err) {
        alert(`Failed to ${action} transaction.`);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Verification</h2>
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
  );
};

export default AdminDashboardScreen;