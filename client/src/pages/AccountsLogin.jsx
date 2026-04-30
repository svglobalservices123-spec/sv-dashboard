import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AccountsLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Account-admin' && password === 'Accounts@Svglobal') {
      localStorage.setItem('isAccountsAdmin', 'true');
      toast.success('Login Successful');
      navigate('/accounts-dashboard');
    } else {
      toast.error('Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-['Inter']">
      <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
            alt="SV Global Services" 
            className="h-16 mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Accounts Login</h1>
          <p className="text-slate-400 mt-2 text-sm text-center">Admin-only Fee Receipt Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountsLogin;
