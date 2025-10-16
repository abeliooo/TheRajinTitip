import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const HomeScreen = ({ userInfo, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSellDropdownOpen, setIsSellDropdownOpen] = useState(false); 
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); 
  const navigate = useNavigate();

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

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">  
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-orange-500 pb-2">Current Auction Items</h2>
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
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

