import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1">
      <div className="h-48 bg-gray-700 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white px-2 text-center">{product.name}</h2>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-400 mb-2">Penjual: {product.user?.username}</p>
        <p className="text-xs text-gray-400">Harga Saat Ini:</p>
        <p className="text-xl font-bold text-orange-500 mb-3">
            Rp {product.currentPrice.toLocaleString('id-ID')}
        </p>
        <div className="text-center text-sm bg-gray-700 rounded-full px-3 py-1 mb-4 text-yellow-300">
          44j 21j 21m lagi
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;