import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );
      setMessage('Login berhasil!');
      console.log('Login success:', data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <p className="text-center text-gray-500">Selamat datang kembali!</p>
        
        {message && <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
        {error && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-300">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-amber-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}


function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [namaAsli, setNamaAsli] = useState('');
  const [email, setEmail] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomorRekening, setNomorRekening] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault(); 
    
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const registrationData = { username, namaAsli, email, nomorTelepon, alamat, password, nomorRekening };
      
      const { data } = await axios.post('http://localhost:5000/api/users/register', registrationData, config);

      setMessage('Pendaftaran berhasil! Silakan login.');
      console.log(data);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Daftar Akun Baru</h1>
        <p className="text-center text-gray-500">Buat akun untuk mulai melelang barang!</p>
        
        {message && <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
        {error && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
            <input type="text" placeholder="Nama Asli (sesuai KTP)" value={namaAsli} onChange={(e) => setNamaAsli(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <input type="text" placeholder="Nomor Telepon" value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <input type="text" placeholder="Alamat Lengkap" value={alamat} onChange={(e) => setAlamat(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
            <input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          </div>
          <input type="text" placeholder="Nomor Rekening (untuk pencairan dana)" value={nomorRekening} onChange={(e) => setNomorRekening(e.target.value)} required className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-300">
            Daftar
          </button>
        </form>
         <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-amber-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          {/* Arahkan halaman utama ke halaman register */}
          <Route path="/" element={<Navigate to="/register" />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

