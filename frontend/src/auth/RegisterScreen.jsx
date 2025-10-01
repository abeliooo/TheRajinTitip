import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
      setError('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    setLoading(true); 
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { confirmPassword, ...dataToSend } = formData;
      await axios.post('http://localhost:5000/api/users/register', dataToSend, config);

      setMessage('Pendaftaran berhasil! Mengarahkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Registration Error Object:", err);
      
      setError(err.response?.data?.message || 'Terjadi kesalahan. Periksa konsol untuk detail.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 space-y-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700 text-white">
        <h1 className="text-3xl font-bold text-center">Daftar Akun Baru</h1>
        {message && <div className="p-3 text-sm text-green-200 bg-green-800/50 rounded-lg text-center">{message}</div>}
        {error && <div className="p-3 text-sm text-red-200 bg-red-800/50 rounded-lg text-center">{error}</div>}
        <form onSubmit={submitHandler} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
             <input name="namaAsli" placeholder="Nama Asli" value={formData.namaAsli} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input name="nomorTelepon" placeholder="Nomor Telepon" value={formData.nomorTelepon} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input name="alamat" placeholder="Alamat" value={formData.alamat} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <input name="confirmPassword" type="password" placeholder="Konfirmasi Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <input name="nomorRekening" placeholder="Nomor Rekening" value={formData.nomorRekening} onChange={handleChange} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-300 disabled:bg-orange-800 disabled:cursor-not-allowed">
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterScreen;

