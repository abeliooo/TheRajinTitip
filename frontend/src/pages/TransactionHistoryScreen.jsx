import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/transactions/my-transactions', config);
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transaction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting for Payment':
        return 'bg-yellow-500 text-yellow-900';
      case 'Completed':
        return 'bg-green-500 text-green-900';
      case 'Canceled':
        return 'bg-red-500 text-red-900';
      default:
        return 'bg-gray-500 text-gray-900';
    }
  };

  return (
    <div className="p-8">
    <div className="max-w-4xl mx-auto">
      <Link to="/home" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
          &larr; Back 
      </Link>
      <h1 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Transaction History</h1>
      {loading ? (
        <p>Loading history...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <Link 
                key={tx._id} 
                to={`/transaction/${tx._id}`}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 border border-gray-700 hover:border-orange-400 transition-all duration-200 cursor-pointer">
                <img src={tx.product?.image || '/images/sample.jpg'} alt={tx.product?.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <h2 className="font-bold text-lg">{tx.product?.name}</h2>
                    <p className="text-sm text-gray-400">Final Price: <span className="font-semibold text-orange-400">Rp {tx.amount.toLocaleString('id-ID')}</span></p>
                  </div>
                  <div className="text-right">
                   <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{new Date(tx.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </Link>
              ))
            ) : (
              <p>You have no transaction history yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryScreen;
