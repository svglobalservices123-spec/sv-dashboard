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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Inter']">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <img 
            src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
            alt="SV Global Services" 
            className="h-20 mb-6 object-contain"
          />
          <div className="w-12 h-1 bg-red-600 mb-4 rounded-full"></div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Accounts Login</h1>
          <p className="text-gray-500 mt-2 text-sm text-center font-medium">Student Fee Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-blue-900 text-xs font-black uppercase tracking-widest mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all duration-200"
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-900 text-xs font-black uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all duration-200"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Powered by SV Global Services</p>
        </div>
      </div>
    </div>
  );
};

export default AccountsLogin;
