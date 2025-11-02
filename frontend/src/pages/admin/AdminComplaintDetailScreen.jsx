import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';

const AdminComplaintDetailScreen = () => {
  const { id: transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data: txData } = await api.get(`/admin/transactions/${transactionId}`, config);
        setTransaction(txData);
        const { data: msgData } = await api.get(`/messages/${transactionId}`, config);
        setMessages(msgData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch details.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaintDetails();
  }, [transactionId, userInfo.token]);

  const handleResolve = async (action) => {
    const actionText = action === 'approve' ? 'approve the complaint (refund buyer)' : 'reject the complaint (pay seller)';
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/admin/complaints/${transactionId}/resolve`, { action }, config);
        alert('Complaint resolved successfully!');
        const { data: txData } = await api.get(`/admin/transactions/${transactionId}`, config);
        setTransaction(txData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to resolve complaint.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <p className="p-8">Loading complaint details...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!transaction) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/dashboard" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
            &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mb-6">Review Complaint</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Transaction Info</h2>
              <p><strong>Product:</strong> {transaction.product.name}</p>
              <p><strong>Buyer:</strong> {transaction.buyer.username}</p>
              <p><strong>Seller:</strong> {transaction.seller.username}</p>
              <p><strong>Amount:</strong> Rp {transaction.amount.toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
              <p className="text-sm text-gray-400">Reason:</p>
              <p className="mb-4 bg-gray-900 p-2 rounded">{transaction.complaintDetails.reason}</p>
              <p className="text-sm text-gray-400">Video Evidence:</p>
              <a href={`${transaction.complaintDetails.videoUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Watch Video
              </a>
            </div>
            {transaction.status === 'Complaint' && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Resolution Action</h2>
                <div className="space-y-3">
                  <Button onClick={() => handleResolve('approve')} fullWidth className="bg-green-600 hover:bg-green-700">Approve Complaint (Refund Buyer)</Button>
                  <Button onClick={() => handleResolve('reject')} fullWidth variant="danger">Reject Complaint (Pay Seller)</Button>
                </div>
              </div>
            )}
             {transaction.status !== 'Complaint' && (
                <p className="text-center text-green-400 bg-green-900/50 p-3 rounded-md">This complaint has been resolved. Status: {transaction.status}</p>
             )}
          </div>

          <div className="lg:col-span-2 bg-gray-800 rounded-lg flex flex-col h-[70vh]">
            <h2 className="text-xl font-bold p-4 border-b border-gray-700">Chat History</h2>
            <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg._id} className={`max-w-md p-3 rounded-lg ${msg.sender._id === transaction.buyer._id ? 'bg-blue-800 self-start' : 'bg-gray-600 self-end'}`}>
                  <p className="font-bold text-sm">{msg.sender.username}</p>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.createdAt).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailScreen;