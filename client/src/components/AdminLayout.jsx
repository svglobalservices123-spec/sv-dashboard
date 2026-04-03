import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, ShieldCheck } from 'lucide-react';

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-muted min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 overflow-y-auto w-full transition-all duration-300">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between mb-8 bg-white p-5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="flex items-center gap-3">
             <div className="bg-secondary p-2 rounded-xl shadow-lg">
                <ShieldCheck className="text-white" size={20} />
             </div>
             <div>
                <h2 className="text-dark font-display font-black text-sm tracking-tight uppercase italic">SV <span className="text-secondary not-italic">ADMIN</span></h2>
                <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase">Portal Security</p>
             </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-blue-500/30 active:scale-90 transition-all"
          >
             <Menu size={20} />
          </button>
        </div>

        {/* Desktop Header */}
        <header className="mb-10 hidden md:block">
          <h1 className="text-4xl font-display font-black text-dark tracking-tighter italic">
            {title}
          </h1>
          <p className="text-gray-400 font-medium mt-1 ml-1">{subtitle}</p>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
