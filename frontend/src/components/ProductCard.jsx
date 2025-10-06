import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown';

const ProductCard = ({ product }) => {
  const timeLeft = useCountdown(product.auctionEndDate);    

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1">
      <div className="h-48 bg-gray-700 flex items-center justify-center">
          <img 
          src={product.image || '/images/sample.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-2">Seller: {product.user?.username}</p>
        <p className="text-xs text-gray-400">Current Price:</p>
        <p className="text-xl font-bold text-orange-500 mb-3">
            Rp {product.currentPrice.toLocaleString('id-ID')}
        </p>

        <div className="text-center text-sm bg-gray-700 rounded-full px-3 py-1 mb-4 text-yellow-300">
          {timeLeft || 'Calculating...'}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;