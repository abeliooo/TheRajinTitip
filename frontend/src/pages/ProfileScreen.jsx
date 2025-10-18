import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';

const ProfileScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await api.get('/users/profile', config);
        
        setFullName(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address);
        setAccountNumber(data.accountNumber);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const updateData = { 
        fullName, 
        email, 
        phoneNumber, 
        address, 
        accountNumber, 
        currentPassword 
      };
      
      if (password) {
        updateData.password = password;
      }

      const { data } = await api.put('/users/profile', updateData, config);

      localStorage.setItem('userInfo', JSON.stringify(data));
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => window.location.reload(), 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
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
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-400">My Profile</h1>
        
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
        {success && <p className="text-green-400 bg-green-900/50 p-3 rounded-md mb-4">{success}</p>}

        {loading ? <p>Loading profile...</p> : (
          <form onSubmit={submitHandler} className="space-y-4">
            <Input 
                name="fullName" 
                label="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                disabled 
                required 
            />

            <Input 
                name="email" 
                type="email" 
                label="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />

            <Input 
                name="phoneNumber" 
                label="Phone Number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
            />
            
            <Input 
                name="accountNumber" 
                label="Bank Account Number"
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)} 
                required 
            />
            
            <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows="3" className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
                <Input 
                    name="currentPassword" 
                    type="password" 
                    label="Current Password"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required 
                />
                <p className="text-sm text-gray-400 mb-2">Leave new passwords blank to keep the current one.</p>
                <Input 
                name="password" 
                type="password" 
                label="New Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                />
                <div className="mt-4">
                    <Input 
                    name="confirmPassword" 
                    type="password" 
                    label="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Updating...' : 'Update Profile'}
            </Button>
            </form>

        )}
      </div>
    </div>
  );
};

export default ProfileScreen;