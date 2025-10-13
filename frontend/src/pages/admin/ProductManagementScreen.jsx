import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchActiveProducts = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/products/active', config);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch active products.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchActiveProducts();
    } else {
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);

  const handleRemove = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product listing? This action cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.delete(`/admin/products/${productId}`, config);

        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
        alert('Product removed successfully!');
      } catch (err) {
        alert('Failed to remove product.');
        setError(err.response?.data?.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/dashboard" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mb-6">Active Product Management</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
            {products.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Current Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-700/50">
                      <img 
                        src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : '/images/sample.jpg'} 
                        alt={product.name}
                        className="w-auto h-24 object-cover my-1 mx-6"
                      />
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">{product.user.username}</td>
                      <td className="px-6 py-4">Rp {product.currentPrice.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <Button onClick={() => handleRemove(product._id)} className="bg-red-600 hover:bg-red-700 text-xs">
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-400">No active products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagementScreen;