import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import io from 'socket.io-client';
import Button from './Button';

const socket = io(process.env.REACT_APP_SOCKET_URL);

const ChatBox = ({ transaction, userInfo }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  const transactionId = transaction?._id;

  useEffect(() => {
    if (transactionId) {
      setLoading(true);
      const fetchMessages = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await api.get(`/messages/${transactionId}`, config);
          setMessages(data);
        } catch (err) {
          setError('Failed to load messages.');
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();

      socket.emit('join_room', transactionId);

      const messageListener = (message) => {
        if (message.transaction === transactionId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };
      socket.on('receive_message', messageListener);

      return () => {
        socket.off('receive_message', messageListener);
      };
    }
  }, [transactionId, userInfo]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !userInfo) return;

    const messageData = {
      transaction: transactionId,
      sender: userInfo._id,
      receiver: transaction.buyer?._id === userInfo._id ? transaction.seller?._id : transaction.buyer?._id,
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const otherUser = transaction.buyer?._id === userInfo._id ? transaction.seller : transaction.buyer;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <p className="font-bold text-lg">{transaction.product?.name || 'Product Deleted'}</p>
        <p className="text-sm text-gray-400">Chat with {otherUser?.username || 'Deleted User'}</p>
      </div>

      <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3">
        {loading && <p className="text-center text-gray-400">Loading messages...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!loading && messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs md:max-w-md p-3 rounded-lg ${
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

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-3 bg-gray-800">
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
  );
};

export default ChatBox;