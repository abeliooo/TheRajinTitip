import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginScreen = ({ setUserInfo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      navigate('/home');

    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white">Login</h1>
        {error && <div className="p-3 text-sm text-red-200 bg-red-800/50 rounded-lg text-center">{error}</div>}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          </div>
          <div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          </div>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-300">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-orange-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;

