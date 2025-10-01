import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomeScreen = ({ userInfo, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data produk.');
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
        <div className="flex items-center">
          <span className="mr-4">Selamat datang, {userInfo.username}!</span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-orange-500 pb-2">Barang Lelang Saat Ini</h2>
        {loading ? <p className="text-center text-lg">Memuat produk...</p> : error ? <p className="text-center text-red-400">{error}</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-400">Belum ada barang yang dilelang saat ini.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;

