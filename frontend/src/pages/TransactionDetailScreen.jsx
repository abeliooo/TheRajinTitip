import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import io from 'socket.io-client';
import ComplaintModal from '../components/ComplaintModal';

const socket = io('http://localhost:5000');

const TransactionDetailScreen = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  
  const { id: transactionId } = useParams();
  const navigate = useNavigate(); 
  const chatEndRef = useRef(null);
  const isBuyer = userInfo && userInfo._id === transaction?.buyer._id;

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(storedUserInfo);

    const fetchTransaction = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${storedUserInfo.token}` } };
        const { data } = await api.get(`/transactions/${transactionId}`, config);
        setTransaction(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  useEffect(() => {
    if (transaction && userInfo) { 
      const fetchMessages = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await api.get(`/messages/${transactionId}`, config);
          setMessages(data);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        }
      };
      fetchMessages();

      socket.emit('join_room', transactionId);

      const messageListener = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      socket.on('receive_message', messageListener);

      return () => {
        socket.off('receive_message', messageListener);
      };
    }
  }, [transaction, transactionId, userInfo]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    try {
      setLoading(true);
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

  const handleConfirmReceipt = async () => {
    if (window.confirm('Are you sure you have received the item?')) {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/transactions/${transactionId}/complete`, {}, config);
        alert('Transaction completed successfully!');
        const { data } = await api.get(`/transactions/${transactionId}`, config);
        setTransaction(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to confirm receipt.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !userInfo) return;

    const messageData = {
      transaction: transactionId,
      sender: userInfo._id,
      receiver: transaction.buyer._id === userInfo._id ? transaction.seller._id : transaction.buyer._id,
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  if (loading) return <p className="text-center text-lg p-8">Loading transaction...</p>;
  if (error) return <p className="text-center text-red-400 p-8">{error}</p>;
  if (!transaction || !userInfo) return <p className="text-center text-lg p-8">Loading...</p>;

  const { product, amount, status } = transaction;

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/history" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
            &larr; Back 
          </Link>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
            <div className="flex items-center gap-4 mb-6">
              <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <h2 className="font-bold text-xl">{product.name}</h2>
                <p className="text-lg text-orange-400 font-semibold">Rp {amount.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-400">Status: <span className="font-semibold">{status}</span></p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              {status === 'Waiting for Payment' && (
                <>
                  <h3 className="font-semibold mb-2">Payment Instructions</h3>
                  <p className="text-sm text-gray-300">
                    Please transfer the exact amount of <span className="font-bold text-orange-400">Rp {amount.toLocaleString('id-ID')}</span> to the following bank account:
                  </p>
                  <div className="bg-gray-900 my-4 p-3 rounded-md">
                    <p className="font-mono">Bank Name: RajinTitip Bank</p>
                    <p className="font-mono">Account Number: 123-456-7890</p>
                    <p className="font-mono">Account Name: PT Rajin Titip Indonesia</p>
                  </div>
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
                </>
              )}

              {status === 'Waiting for Confirmation' && (
                <p className="text-center text-blue-400 bg-blue-900/50 p-3 rounded-md">
                  Your payment is being verified by the admin. Please wait.
                </p>
              )}

              {status === 'Processing' && (
                <p className="text-center text-blue-400 bg-blue-900/50 p-3 rounded-md">
                  Your payment is confirmed. Waiting for the seller to ship the item.
                </p>
              )}

              {status === 'Sending' && (
                <div>
                  <h3 className="font-semibold mb-2">Item is on its way!</h3>
                  <p className="text-sm text-gray-300">The seller has shipped your item. You can track it using the number below:</p>
                  <div className="bg-gray-900 my-4 p-3 rounded-md">
                    <p className="font-mono text-lg text-orange-400">{transaction.trackingNumber || 'Tracking number not available'}</p>
                  </div>
                  <Button onClick={handleConfirmReceipt} fullWidth disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm Item Received'}
                  </Button>
                </div>
              )}
              
              {status === 'Delivered' && (
                <p className="text-center text-green-400 bg-green-900/50 p-3 rounded-md">
                  This transaction is complete. Thank you!
                </p>
              )}
              
              {status === 'Canceled' && (
                <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">
                  This transaction has been canceled by the admin.
                </p>
              )}            
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold p-4 border-b border-gray-700">Chat with {transaction.buyer._id === userInfo._id ? transaction.seller.username : transaction.buyer.username}</h2>
            
            <div className="p-4 h-80 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender._id === userInfo._id
                      ? 'bg-orange-600 self-end'
                      : 'bg-gray-600 self-start'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-300 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
          {isBuyer && status === 'Delivered' && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mt-6">
                <h3 className="font-bold">Problem with your item?</h3>
                <p className="text-sm text-red-200 mt-1 mb-3">If the item is not as described, you can file a complaint. An admin will review your case.</p>
                <Button onClick={() => setIsComplaintModalOpen(true)} variant="danger">
                  File a Complaint
                </Button>
              </div>
            )}
        </div>
      </div>
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        transactionId={transactionId}
      />
    </>
  );
};

export default TransactionDetailScreen;