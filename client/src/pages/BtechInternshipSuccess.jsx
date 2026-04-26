import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, ArrowLeft, ShieldCheck } from 'lucide-react';

const BtechInternshipSuccess = () => {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
        <div className="mb-10 flex justify-center relative">
          <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-50 rounded-full scale-150"></div>
          <div className="bg-emerald-100 p-8 rounded-[2.5rem] shadow-xl relative z-10 animate-in zoom-in duration-700">
            <CheckCircle2 size={72} className="text-emerald-600" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full mb-6 border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-1000">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Submission Verified & Logged</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-dark mb-4 tracking-tighter italic uppercase">
          Internship <span className="text-emerald-600 not-italic">Confirmed!</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          Your application for the <strong>Btech/Degree Internship Program</strong> has been successfully submitted. Our academic team will review your documents and contact you soon.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/btech-internship" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/30">
            <ArrowLeft size={16} /> Back to Registration
          </Link>
          <Link to="https://svglobalservices.com/industrial-training/" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border border-gray-200 text-dark rounded-2xl hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest">
            <Home size={16} /> Main Website
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Transaction Reference: BT-{Date.now().toString().slice(-6)}</p>
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Svglobal Services • Internship Portal</p>
    </div>
  );
};

export default BtechInternshipSuccess;
