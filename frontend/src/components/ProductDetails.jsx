import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import useCountdown from '../hooks/useCountdown';
import Input from './Input';
import Button from './Button';
import PaymentScreen from '../pages/PaymentScreen';

const socket = io('http://localhost:5000');

const ProductDetail = () => {
  const [product, setProduct] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [bidAmount, setBidAmount] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const timeLeft = useCountdown(product.auctionEndDate);
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const userInfo = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
      return null;
    }
  }, []);

  const handleProceedToPayment = async () => {
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data: transactionData } = await api.post('/transactions', { productId }, config);
      
      navigate('/payment', { state: { transaction: transactionData } });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to proceed payment.');
    }
  };

  React.useEffect(() => {
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
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.post(`/products/${productId}/bids`, { amount: bidAmount }, config);
      setSuccess('Your bid has been placed!');
      setProduct(data); 
      setBidAmount(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid.');
    }
  };

  const isAuctionEnded = timeLeft === 'Auction ended';
  const highestBidder = product.bids && product.bids.length > 0 ? product.bids[product.bids.length - 1] : null;
  const isWinner = highestBidder && userInfo && highestBidder.user._id === userInfo._id;
  const isSeller = product.user?._id === userInfo?._id;

  const renderAuctionStatus = () => {
    if (!isAuctionEnded) {
      if (isSeller) {
        return (
          <div className="text-center bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-300">This is your own product.</h3>
            <p className="mt-2 text-gray-400">You cannot bid on an item you are selling.</p>
          </div>
        );
      }
      return (
        <form onSubmit={placeBidHandler}>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-2">
            Enter your bid (must be higher than the current price)
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <Input 
              name="bidAmount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`min. Rp ${(product.currentPrice + 1)?.toLocaleString('id-ID')}`}
              required
            />
            </div>
            
            <Button type="submit">Bid</Button>
          </div>
        </form>
      );
    } else {
      if (isWinner) {
        return (
          <div className="text-center bg-green-900/50 border border-green-500 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-green-300">Congratulations, you won!</h3>
            <p className="mt-2 text-gray-300">You won this auction with a bid of Rp {highestBidder.amount.toLocaleString('id-ID')}.</p>
            <Button onClick={handleProceedToPayment} className="mt-4">
              Proceed to Payment
            </Button>
          </div>
        );
      } else if (highestBidder) {
        return (
          <div className="text-center bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-300">This auction has ended.</h3>
            <p className="mt-2 text-gray-400">
              The winner is  <span className="font-bold text-orange-400">{highestBidder.user.username}</span> with a bid of Rp {highestBidder.amount.toLocaleString('id-ID')}.
            </p>
          </div>
        );
      } else {
        return (
          <div className="text-center bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-300">This auction has ended.</h3>
            <p className="mt-2 text-gray-400">There were no bids for this item.</p>
          </div>
        );
      }
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
            <img src={product.image || '/images/sample.jpg'} alt={product.name} className="w-full h-full object-cover rounded-lg shadow-lg" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
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
              {highestBidder && !isAuctionEnded && (
                <p className="text-sm text-gray-400 mt-2">
                  Highest Bid by: <span className="font-semibold text-orange-400">{highestBidder.user.username}</span>
                </p>
              )}
              <p className={`text-sm mt-1 ${isAuctionEnded ? 'text-red-400' : 'text-yellow-400'}`}>
                  Time Left: {timeLeft || 'Calculating...'}
              </p>
            </div>
            
            <div className="mt-auto">
              {error && <p className="text-red-400 text-center mb-4">{error}</p>}
              {success && <p className="text-green-400 text-center mb-4">{success}</p>}
              {renderAuctionStatus()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;