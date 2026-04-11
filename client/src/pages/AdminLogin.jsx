import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated login for demo purposes
    // Use proper backend auth for real apps
    setTimeout(() => {
      if (email === 'admin@svsolutions.com' && password === 'admin@123') {
        localStorage.setItem('isSVAdmin', 'true');
        toast.success('Login Successful!');
        navigate('/admin');
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 z-10 border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-display font-black text-dark tracking-tighter">Admin <span className="text-secondary italic">Access</span></h2>
          <p className="text-gray-400 font-medium mt-2">Enter your secure credentials to proceed</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Registry Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-12"
                placeholder="enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pl-12"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Initialize Access</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-dark transition-all">
            Secure Audit Log Active
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
