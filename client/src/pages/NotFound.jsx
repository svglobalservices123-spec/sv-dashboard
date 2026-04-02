import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SearchCode } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-primary/10 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner">
        <SearchCode size={64} className="text-primary" />
      </div>
      
      <h1 className="text-8xl font-black text-dark mb-4 tracking-tighter shadow-sm">404</h1>
      <h2 className="text-2xl font-bold text-gray-500 mb-8 uppercase tracking-widest">Resource Not Found</h2>
      
      <p className="max-w-md text-gray-400 font-medium mb-12 leading-relaxed italic">
        The application was unable to locate the requested data registry. Please check the URL or return to safety.
      </p>
      
      <Link to="/" className="btn-primary group flex items-center justify-center gap-2 py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
        <ArrowLeft size={18} /> BACK TO SAFETY
      </Link>
    </div>
  );
};

export default NotFound;
