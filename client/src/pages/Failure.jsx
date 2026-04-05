import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';

const Failure = () => {
  const location = useLocation();
  const message = location.state?.message || 'The payment was not completed or was cancelled.';

  return (
    <div className="min-h-screen bg-[#fef2f2] flex flex-col items-center justify-center p-4 selection:bg-red-200">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(220,38,38,0.1)] border border-red-50 p-10 text-center relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 to-red-500"></div>

        <div className="mb-8 flex justify-center">
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-pulse">
            <XCircle size={64} className="text-red-500" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <AlertTriangle size={12} /> Payment Failed
        </div>

        <h1 className="text-3xl font-display font-black text-dark mb-4 tracking-tighter uppercase italic">
          Transaction <span className="text-red-500 not-italic">Incomplete</span>
        </h1>
        
        <p className="text-gray-500 font-bold text-[13px] mb-8 leading-relaxed px-4">
          {message}
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-3 text-left mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">Money deducted? Don't worry, it reflects in 48h.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">Verification failed? Check your network connection.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" className="w-full py-5 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_50px_-10px_rgba(239,68,68,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
            <RotateCcw size={18} /> Retry Payment
          </Link>
          
          <Link to="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-dark text-[10px] font-black uppercase tracking-widest transition-all">
            <ArrowLeft size={14} /> Back to Home Portal
          </Link>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 SVGLOBAL SERVICES • SECURE PORTAL</p>
    </div>
  );
};

export default Failure;
