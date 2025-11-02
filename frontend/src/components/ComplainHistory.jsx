import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchComplaintHistory = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/api/transactions/my-complaints', config);
        setComplaints(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch complaint history.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintHistory();
  }, [userInfo.token]);

  if (loading) return <p className="text-center p-4">Loading complaint history...</p>;
  if (error) return <p className="text-center text-red-400 p-4">{error}</p>;

  return (
    <div className="space-y-4">
      {complaints.length > 0 ? (
        complaints.map((complaint) => (
          <div key={complaint._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-4">
            <img 
              src={complaint.product.image ? `${complaint.product.image}` : '/images/sample.jpg'} 
              alt={complaint.product.name} 
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-grow">
              <h3 className="font-bold text-md">{complaint.product.name}</h3>
              <p className="text-sm text-gray-400">
                Your role: {complaint.buyer._id === userInfo._id ? 'Buyer' : 'Seller'}
              </p>
              <p className="text-sm">
                Status: 
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  complaint.status === 'Completed' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
                }`}>
                  {complaint.status}
                </span>
              </p>
            </div>
            <Link to={`/transaction/${complaint._id}`}>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-xs">
                View Details
              </button>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg">You have no complaint history.</p>
      )}
    </div>
  );
};

export default ComplaintHistory;