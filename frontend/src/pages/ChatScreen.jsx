import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ChatBox from '../components/ChatBox'; 

const ChatScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [userInfo, setUserInfo] = useState(null); 
  const [activeConversation, setActiveConversation] = useState(null); 

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(storedUserInfo);

    const fetchConversations = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${storedUserInfo.token}` },
        };
        const { data } = await api.get('/transactions/my-conversations', config);
        setConversations(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    if (storedUserInfo) {
      fetchConversations();
    } else {
      setLoading(false);
      setError('User not found. Please log in again.');
    }
  }, []);

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]"> 
      <div className="p-8 border-b-2 border-orange-500">
         <h1 className="text-3xl font-bold">My Chats</h1>
      </div>
      
      <div className="flex flex-grow overflow-hidden">
        <div className="w-full md:w-1/3 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {loading ? (
            <p className="p-4">Loading chats...</p>
          ) : error ? (
            <p className="p-4 text-red-400">{error}</p>
          ) : (
            <div>
              {conversations.length > 0 ? (
                conversations.map((convo) => {
                  const otherUser = userInfo._id === convo.buyer._id ? convo.seller : convo.buyer;
                  return (
                    <div 
                      key={convo._id} 
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${activeConversation?._id === convo._id ? 'bg-orange-900/50' : ''}`}
                      onClick={() => handleConversationClick(convo)}
                    >
                      <p className="font-bold truncate">{convo.product.name}</p>
                      <p className="text-sm text-gray-400">vs {otherUser.username}</p>
                    </div>
                  );
                })
              ) : (
                <p className="p-4 text-gray-400">No conversations yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex w-2/3 flex-col bg-gray-900">
           {activeConversation && userInfo ? (
             <ChatBox 
               transaction={activeConversation} 
               userInfo={userInfo} 
             />
           ) : (
             <div className="flex flex-col justify-center items-center h-full">
               <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;