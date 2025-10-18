import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; 
import Button from '../components/Button'; 
import Input from '../components/Input'; 

const MyListingsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState({});

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/products/my-products', config);

        console.log('Data dari API:', data);

        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your products.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);
  
  const handleTrackingNumberChange = (productId, value) => {
    setTrackingNumbers(prev => ({ ...prev, [productId]: value }));
  };

  const handleShipItem = async (productId, transactionId) => {
    const trackingNumber = trackingNumbers[productId];
    if (!trackingNumber) {
      alert('Please enter a tracking number.');
      return;
    }

    if (window.confirm('Are you sure you want to ship this item?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await api.put(`/transactions/${transactionId}/ship`, { trackingNumber }, config);
        
        alert('Item successfully marked as shipped!');
        window.location.reload(); 

      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update shipping status.');
      }
    }
  };

  if (loading) return <p className="text-center p-8">Loading your listings...</p>;
  if (error) return <p className="text-center text-red-400 p-8">{error}</p>;

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/home" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
          &larr; Back 
        </Link>
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">My Items for Sale</h1>
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} 
                className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${product.status === 'removed' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <img src={product.image || '/images/sample.jpg'} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-400">
                      Status: <span className="font-semibold text-orange-400">{product.status}</span>
                    </p>
                    {product.transaction && (
                      <p className="text-xs text-yellow-400 mt-1">Transaction Status: {product.transaction.status}</p>
                    )}
                  </div>
                </div>

                {product.status === 'removed' ? (
                  <div className="border-t border-gray-700 mt-4 pt-4 bg-red-900 bg-opacity-30 p-3 rounded-md">
                    <h3 className="font-bold text-red-400">This item was removed by an Admin.</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      <strong>Reason:</strong> {product.removalReason}
                    </p>
                  </div>
                ) : product.transaction?.status === 'Processing' ? (
                  <div className="border-t border-gray-700 mt-4 pt-4">  
                    <p className="text-sm text-green-400 mb-2">Payment confirmed! Please ship the item.</p>
                    <div className="flex gap-4">
                      <Input
                        name="trackingNumber"
                        placeholder="Enter Tracking Number"
                        value={trackingNumbers[product._id] || ''}
                        onChange={(e) => handleTrackingNumberChange(product._id, e.target.value)}
                      />
                      <Button onClick={() => handleShipItem(product._id, product.transaction._id)}>
                        Ship
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p>You haven't listed any items for sale yet.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyListingsScreen;