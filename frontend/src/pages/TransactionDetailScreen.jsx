import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';

const TransactionDetailScreen = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');

  const { id: transactionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get(`/transactions/${transactionId}`, config);
        setTransaction(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transaction details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!paymentProofFile) {
      alert('Please select a payment proof file.');
      return;
    }

    const formData = new FormData();
    formData.append('paymentProof', paymentProofFile);

    setLoading(true);
     try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await api.put(`/transactions/${transactionId}/pay`, formData, config);

      alert('Payment proof submitted successfully!');
      navigate('/history'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment proof.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-lg p-8">Loading transaction...</p>;
  if (error) return <p className="text-center text-red-400 p-8">{error}</p>;
  if (!transaction) return null;

  const { product, amount, status } = transaction;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/history" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
          &larr; Back 
        </Link>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
          <div className="flex items-center gap-4 mb-6">
            <img src={product.image || '/images/sample.jpg'} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
            <div>
              <h2 className="font-bold text-xl">{product.name}</h2>
              <p className="text-lg text-orange-400 font-semibold">Rp {amount.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-400">Status: {status}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-semibold mb-2">Payment Instructions</h3>
            <p className="text-sm text-gray-300">
              Please transfer the exact amount of <span className="font-bold text-orange-400">Rp {amount.toLocaleString('id-ID')}</span> to the following bank account:
            </p>
            <div className="bg-gray-900 my-4 p-3 rounded-md">
              <p className="font-mono">Bank Name: RajinTitip Bank</p>
              <p className="font-mono">Account Number: 123-456-7890</p>
              <p className="font-mono">Account Name: PT Rajin Titip Indonesia</p>
            </div>

            {status === 'Waiting for Payment' && (
              <form onSubmit={submitHandler} className="mt-4">
                <label htmlFor="paymentProof" className="block text-sm font-medium mb-2">
                  Upload Payment Screenshot
                </label>
                <input
                  id="paymentProof"
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:text-sm file:font-semibold file:bg-white file:text-orange-600 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  File types allowed: JPG, PNG. Max size: 5MB.
                </p>

                {previewSource && (
                  <div className="my-4">
                    <img src={previewSource} alt="Preview" className="max-h-60 rounded-lg mx-auto" />
                  </div>
                )}

                <Button type="submit" fullWidth disabled={loading || !paymentProofFile}>
                  {loading ? 'Submitting...' : 'Confirm Payment'}
                </Button>
              </form>
            )}

            {status !== 'Waiting for Payment' && (
              <p className="text-center text-green-400 bg-green-900/50 p-3 rounded-md">
                You have already submitted payment for this item.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailScreen;
