// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form); // update URL if needed
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {message && <p className="mb-2 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {['name', 'phoneNumber', 'email', 'password', 'confirmPassword'].map((field) => (
          <input
            key={field}
            type={field.includes('password') ? 'password' : 'text'}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
