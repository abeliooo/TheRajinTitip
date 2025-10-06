import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: '',
    namaAsli: '',
    email: '',
    nomorTelepon: '',
    alamat: '',
    password: '',
    confirmPassword: '',
    nomorRekening: '',
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault(); 
    setMessage('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true); 
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await api.post('/users/register', dataToSend);

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error("Registration Error Object:", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 space-y-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700 text-white">
        <h1 className="text-3xl font-bold text-center">Register New Account</h1>
        {message && <div className="p-3 text-sm text-green-200 bg-green-800/50 rounded-lg text-center">{message}</div>}
        {error && <div className="p-3 text-sm text-red-200 bg-red-800/50 rounded-lg text-center">{error}</div>}
        
        <form onSubmit={submitHandler} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
             <Input name="namaAsli" placeholder="Full Name" value={formData.namaAsli} onChange={handleChange} required />
          </div>
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input name="nomorTelepon" placeholder="Phone Number" value={formData.nomorTelepon} onChange={handleChange} required />
          <Input name="alamat" placeholder="Address" value={formData.alamat} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <Input name="nomorRekening" placeholder="Bank Account Number" value={formData.nomorRekening} onChange={handleChange} required />
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterScreen;
