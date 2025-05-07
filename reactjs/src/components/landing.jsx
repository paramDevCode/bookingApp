import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [area, setArea] = useState('');
  const areaOptions = ['Ambattur', 'Pudur', 'Avadi'];
  const navigate = useNavigate();

  const handleContinue = () => {
    if (area) {
      navigate('/register');
    } else {
      alert('Please select an area');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo */}
      <img
        src="/logo.png" // Replace with your actual logo path
        alt="Tailoring App Logo"
        className="w-24 h-24 mb-6"
      />

      {/* Welcome Text */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Welcome to Tailoring App
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Please select your area to continue
      </p>

      {/* Dropdown */}
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Area --</option>
        {areaOptions.map((a) => (
          <option key={a.toLowerCase()} value={a.toLowerCase()}>
            {a}
          </option>
        ))}
      </select>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Continue
      </button>
    </div>
  );
};

export default Landing;
