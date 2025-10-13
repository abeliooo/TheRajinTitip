import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios'; 
import Button from '../../components/Button'; 
import '../../modal.css';

const ProductApprovalScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchPendingProducts = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/products/pending', config);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchPendingProducts();
    } else {
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);

  const handleApproval = async (productId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this product?`)) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/admin/products/${productId}/review`, { action }, config);

        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
        alert(`Product successfully ${action}d!`);
      } catch (err) {
        alert(`Failed to ${action} product.`);
        setError(err.response?.data?.message);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/dashboard" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-white mb-6">Product Approval Dashboard</h1>
        {loading ? (
          <p className="text-center text-lg text-white">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No products are waiting for approval.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Starting Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">End Date</th>
                  <th className="px-6 py-3 border-b border-gray-700 text-center text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-white">{product.name}</td>
                    <td className="px-6 py-4 text-white">{product.user.username}</td>
                    <td className="px-6 py-4 text-white">Rp {product.startingPrice.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-white">{new Date(product.auctionEndDate).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-center">
                      <Button onClick={() => setSelectedProduct(product)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">Review: {selectedProduct.name}</h2>
            <img 
              src={selectedProduct.image ? (selectedProduct.image.startsWith('http') ? selectedProduct.image : `http://localhost:5000${selectedProduct.image}`) : '/images/sample.jpg'} 
              alt={selectedProduct.name}
              className="w-auto object-cover rounded-lg mb-4"
            />

            <h3 className="font-semibold">Description:</h3>
            <p className="bg-gray-700 p-2 rounded mb-4">{selectedProduct.description}</p>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setSelectedProduct(null)} className="bg-gray-600 hover:bg-gray-700">Close</Button>
              <Button onClick={() => { handleApproval(selectedProduct._id, 'reject'); setSelectedProduct(null); }} className="bg-red-600 hover:bg-red-700">Reject</Button>
              <Button onClick={() => { handleApproval(selectedProduct._id, 'approve'); setSelectedProduct(null); }} className="bg-green-600 hover:bg-green-700">Approve</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApprovalScreen;