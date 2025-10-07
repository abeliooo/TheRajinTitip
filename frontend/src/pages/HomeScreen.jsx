import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; 
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const HomeScreen = ({ userInfo, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-orange-500">The Rajin Titip</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {userInfo.username}!</span>
          
          <Link to="/history" className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg">
            History
          </Link>
          <span className="border-r border-gray-600 h-6"></span> 

          <Link to="/sell" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
            + Sell Item
          </Link>
          <Button onClick={onLogout} variant="danger">
            Logout
          </Button>
        </div>
      </header>
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-orange-500 pb-2">Current Auction Items</h2>
        {loading ? <p className="text-center text-lg">Loading...</p> : error ? <p className="text-center text-red-400">{error}</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-400">There are no items currently being auctioned.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;

