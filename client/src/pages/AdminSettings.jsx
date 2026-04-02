import React from 'react';
import Sidebar from '../components/Sidebar';
import { Settings, ShieldAlert, Key, Zap, Save, UserCog, MailOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const handleSave = () => {
    toast.success('Settings saved securely on registry.');
  };

  return (
    <div className="flex bg-muted min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-display font-black text-dark tracking-tighter italic">Administrative <span className="text-secondary not-italic uppercase">Configurations</span></h1>
            <p className="text-gray-400 font-medium">Control the security and behavior of the registry system</p>
          </div>
          <button onClick={handleSave} className="btn-primary rounded-2xl flex items-center gap-2 group py-4 px-10 shadow-xl overflow-hidden relative">
            <span className="relative z-10 flex items-center gap-2 font-black uppercase tracking-[0.2em] text-xs">
              <Save size={18} /> Update Registry
            </span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Security Panel */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 relative overflow-hidden group transition-all hover:translate-y-[-10px] cursor-default">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all pointer-events-none">
                <ShieldAlert size={150} />
            </div>
            <h3 className="text-xl font-black text-dark mb-10 flex items-center gap-3">
               <ShieldAlert className="text-secondary" /> Access Governance
            </h3>
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registry Admin Email</label>
                  <div className="relative">
                    <MailOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="email" defaultValue="admin@svsolutions.com" className="input-field pl-12" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Key Pattern</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="password" placeholder="••••••••" className="input-field pl-12" />
                  </div>
               </div>
               <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 flex items-center justify-between mt-6 group/item transition-all hover:bg-white hover:shadow-2xl">
                   <div className="flex items-center gap-4">
                      <Zap className="text-secondary transition-all group-hover/item:scale-125" />
                      <div>
                        <p className="text-xs font-black text-dark tracking-tighter uppercase">Audit Log Persistence</p>
                        <p className="text-[10px] text-gray-400 font-bold italic mt-1">Status: SECURED ENCRYPTION ACTIVE</p>
                      </div>
                   </div>
                   <div className="w-12 h-6 bg-secondary rounded-full relative p-1 shadow-inner shadow-black/20">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
            </div>
          </div>

          {/* System Config */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 relative overflow-hidden group transition-all hover:translate-y-[-10px] cursor-default lg:col-span-1">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all pointer-events-none">
                <UserCog size={150} />
             </div>
             <h3 className="text-xl font-black text-dark mb-10 flex items-center gap-3">
                <UserCog className="text-primary" /> Application Workflow
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Submission Rate Limit</label>
                   <select className="input-field appearance-none cursor-pointer">
                      <option>1 Submission per 60 Seconds</option>
                      <option>Unlimited (Testing Phase)</option>
                      <option>System Lockdown (Manual Only)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attachment Protocol</label>
                   <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="p-4 bg-primary text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Active: PDF/PNG/JPG</div>
                      <div className="p-4 bg-gray-50 text-gray-300 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-gray-200">DOCX Security Shield</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
