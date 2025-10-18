import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';
import Input from '../../components/Input'; 
import '../../modal.css'; 

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [removalReason, setRemovalReason] = useState('');

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.isAdmin) {
          navigate('/admin/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/products/active', config);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch active products.');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveProducts();
  }, [navigate]);

  const openRemoveModal = (product) => {
    setSelectedProduct(product);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (!removalReason.trim()) {
      alert('Please provide a reason for removal.');
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        data: { reason: removalReason }
      };

      await api.delete(`/admin/products/${selectedProduct._id}`, config);

      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== selectedProduct._id)
      );

      alert('Product removed successfully!');
      
      setShowRemoveModal(false);
      setRemovalReason('');
      setSelectedProduct(null);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove product.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Active Product Management</h1>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img 
                            className="h-16 w-16 object-cover rounded-md"
                            src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : '/images/sample.jpg'} 
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Rp {product.currentPrice.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button onClick={() => openRemoveModal(product)} variant="danger" className="text-xs">
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

      {showRemoveModal && selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">Remove: {selectedProduct.name}</h2>
            <label htmlFor="removalReason" className="block text-sm font-medium text-gray-300 mb-2">
              Reason for Removal
            </label>
            <textarea
              id="removalReason"
              rows="4"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500"
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setShowRemoveModal(false)} className="bg-gray-600 hover:bg-gray-700">Cancel</Button>
              <Button onClick={confirmRemove} variant="danger">Confirm Removal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementScreen;