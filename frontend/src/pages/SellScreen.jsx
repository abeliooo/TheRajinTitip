import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';

const SellScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [image, setImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.post(
        '/products',
        { name, description, startingPrice, auctionEndDate, image },
        config
      );

      alert('Product successfully submitted and is now awaiting admin approval.');
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create auction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <Link to="/home" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
          &larr; Back 
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-400">Titip Your Item</h1>
        
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}

        <form onSubmit={submitHandler} className="space-y-6">
          <Input name="name" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium sr-only">Description</label>
            <textarea 
              id="description" 
              name="description"
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows="4" 
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>
          
          <div>
            <Input name="image" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
            <p className="text-xs text-gray-400 mt-1">For now, please enter an image URL from the internet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="startingPrice" type="number" placeholder="Starting Price (Rp)" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required />
            <Input name="auctionEndDate" type="datetime-local" placeholder="Auction End Date" value={auctionEndDate} onChange={(e) => setAuctionEndDate(e.target.value)} required />
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Submitting...' : 'Start Auction'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SellScreen;
