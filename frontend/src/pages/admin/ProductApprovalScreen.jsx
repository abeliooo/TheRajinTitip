import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 
import Button from '../../components/Button'; 
import '../../modal.css';

const ProductApprovalScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.isAdmin) {
          navigate('/admin/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/products/pending', config);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingProducts();
  }, [navigate]);

  const handleApproval = async (productId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this product?`)) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/admin/products/${productId}/review`, { action }, config);

        setProducts(prevProducts =>
          prevProducts.filter(product => product._id !== productId)
        );
        alert(`Product successfully ${action}d!`);
      } catch (err) {
        alert(`Failed to ${action} product.`);
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Product Approval</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
          {products.length === 0 ? (
            <p className="p-6 text-center text-gray-400">No products are waiting for approval.</p>
          ) : (
            <table className="w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Starting Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm">{product.name}</td>
                    <td className="px-6 py-4 text-sm">{product.user.username}</td>
                    <td className="px-6 py-4 text-sm">Rp {product.startingPrice.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-sm">{new Date(product.auctionEndDate).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-center">
                      <Button onClick={() => setSelectedProduct(product)} className="text-xs">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">Review: {selectedProduct.name}</h2>
            <img 
              src={selectedProduct.image ? (selectedProduct.image.startsWith('http') ? selectedProduct.image : `http://localhost:5000${selectedProduct.image}`) : '/images/sample.jpg'} 
              alt={selectedProduct.name}
              className="w-full object-contain rounded-lg mb-4 max-h-80"
            />
            <h3 className="font-semibold">Description:</h3>
            <p className="bg-gray-700 p-2 rounded mb-4 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedProduct.description}
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setSelectedProduct(null)} className="bg-gray-600 hover:bg-gray-700">Close</Button>
              <Button onClick={() => { handleApproval(selectedProduct._id, 'reject'); setSelectedProduct(null); }} variant="danger">Reject</Button>
              <Button onClick={() => { handleApproval(selectedProduct._id, 'approve'); setSelectedProduct(null); }} className="bg-green-600 hover:bg-green-700">Approve</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApprovalScreen;