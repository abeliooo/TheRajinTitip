import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [success, setSuccess] = useState('');

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const placeBidHandler = async (e) => {
    e.preventDefault();
    setSuccess(''); 
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/products/${productId}/bids`,
        { amount: bidAmount },
        config
      );

      setSuccess('Tawaran Anda berhasil ditempatkan!');
      setProduct(data); 
      setBidAmount(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menempatkan tawaran.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link to="/home" className="mb-8 inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
        &larr; Kembali
      </Link>

      {loading ? <p>Memuat...</p> : error ? <p className="text-red-400">{error}</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image || '/images/sample.jpg'} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-3 text-orange-400">{product.name}</h1>
            <p className="text-sm text-gray-400 mb-4">Dilelang oleh: {product.user?.username || 'Anonim'}</p>
            
            <div className="border-t border-gray-700 pt-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
              <p className="text-gray-300">{product.description}</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-md mb-6">
                <p className="text-gray-400 text-sm">HARGA SAAT INI</p>
                <p className="text-3xl font-bold text-orange-500">
                    Rp {product.currentPrice?.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-yellow-400 mt-1">
                    Waktu Sisa: 3j 14m 5s 
                </p>
            </div>

            {error && <p className="text-red-400 text-center my-4">{error}</p>}
            {success && <p className="text-green-400 text-center my-4">{success}</p>}

            <form onSubmit={placeBidHandler}>
                <label htmlFor="bid" className="block text-sm font-medium text-gray-300 mb-2">
                    Masukkan Tawaran Anda (harus lebih tinggi dari harga saat ini)
                </label>
                <div className="flex gap-4">
                    <input 
                        type="number"
                        id="bid"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`min. Rp ${(product.currentPrice + 1).toLocaleString('id-ID')}`}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                    <button 
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md"
                    >
                        Tawar
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;