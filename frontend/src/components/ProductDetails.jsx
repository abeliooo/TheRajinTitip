import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import useCountdown from '../hooks/useCountdown';
import Input from './Input';
import Button from './Button';

const socket = io('http://localhost:5000');

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [success, setSuccess] = useState('');  
  const timeLeft = useCountdown(product.auctionEndDate);

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    socket.on('bid_update', (updatedProduct) => {
      if (updatedProduct._id === productId) {
        setProduct(updatedProduct);
      }
    });

    return () => {
      socket.off('bid_update');
    };
  }, [productId]);

  const placeBidHandler = async (e) => {
    e.preventDefault();
    setSuccess(''); 
    setError('');
    
    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.post(
        `/products/${productId}/bids`,
        { amount: bidAmount },
        config
      );

      setSuccess('Your bid has been placed!');
      setProduct(data); 
      setBidAmount(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link to="/home" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
        &larr; Back
      </Link>

      {loading ? <p>Loading...</p> : error ? <p className="text-red-400">{error}</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image || '/images/sample.jpg'} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-3 text-orange-400">{product.name}</h1>
            <p className="text-sm text-gray-400 mb-4">Auctioned by: {product.user?.username || 'Anonymous'}</p>
            
            <div className="border-t border-gray-700 pt-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{product.description}</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-md mb-6">
              <p className="text-gray-400 text-sm">CURRENT PRICE</p>
              <p className="text-3xl font-bold text-orange-500">
                  Rp {product.currentPrice?.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-yellow-400 mt-1">
                  Time Left: {timeLeft || 'Calculating...'}
              </p>
            </div>

            {error && <p className="text-red-400 text-center my-4">{error}</p>}
            {success && <p className="text-green-400 text-center my-4">{success}</p>}

            <form onSubmit={placeBidHandler}>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter your bid (must be higher than the current price)
                </label>
                <div className="flex gap-4">
                    <Input 
                        name="bidAmount"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`min. Rp ${(product.currentPrice + 1)?.toLocaleString('id-ID')}`}
                        required
                    />
                    <Button type="submit">
                        Bid
                    </Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
