import React, { useState } from 'react';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!phone || !password) {
      alert('Please enter both phone number and password.');
      return;
    }
    // Proceed with login logic
    console.log('Logging in with', phone, password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <img src="/logo192.png" alt="Logo" className="w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow w-full max-w-xs"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
