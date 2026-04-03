import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { ShieldAlert, Key, Zap, Save, UserCog, MailOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const handleSave = () => {
    toast.success('Settings saved securely on registry.');
  };

  return (
    <AdminLayout title={<>Administrative <span className="text-secondary not-italic uppercase">Configurations</span></>} subtitle="Control the security and behavior of the registry system">
        {/* Mobile-only save button at top */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 md:hidden">
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">System Online</p>
            </div>
            <button onClick={handleSave} className="btn-primary w-full sm:w-auto rounded-2xl flex items-center justify-center gap-3 py-4 px-10 shadow-xl overflow-hidden relative active:scale-95 transition-all">
              <Save size={18} /> Update Registry
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Security Panel */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group transition-all hover:translate-y-[-5px]">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all pointer-events-none text-secondary">
                <ShieldAlert size={150} />
            </div>
            <h3 className="text-xl font-black text-dark mb-10 flex items-center gap-4">
               <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><ShieldAlert size={20} /></span>
               Access Governance
            </h3>
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Registry Admin Email</label>
                  <div className="relative">
                    <MailOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="email" defaultValue="admin@svsolutions.com" className="input-field pl-12 py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary font-bold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Security Key Pattern</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="password" placeholder="••••••••" className="input-field pl-12 py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" />
                  </div>
               </div>
               <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 flex items-center justify-between mt-6 group/item transition-all hover:bg-white hover:shadow-xl">
                   <div className="flex items-center gap-4">
                      <Zap className="text-secondary transition-all group-hover/item:scale-125" />
                      <div>
                        <p className="text-xs font-black text-dark tracking-tighter uppercase">Audit Log Persistence</p>
                        <p className="text-[10px] text-gray-400 font-bold italic mt-1 uppercase tracking-wider">Status: Secure Active</p>
                      </div>
                   </div>
                   <div className="w-12 h-6 bg-secondary rounded-full relative p-1 shadow-inner shadow-black/20">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
            </div>
          </div>

          {/* System Config */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group transition-all hover:translate-y-[-5px]">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all pointer-events-none text-primary">
                <UserCog size={150} />
             </div>
             <h3 className="text-xl font-black text-dark mb-10 flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><UserCog size={20} /></span>
                Application Workflow
             </h3>
             <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Submission Rate Limit</label>
                   <select className="input-field appearance-none cursor-pointer py-4 px-6 bg-muted/30 border-transparent focus:bg-white focus:border-primary font-bold">
                      <option>1 Submission per 60 Seconds</option>
                      <option>Unlimited (Testing Phase)</option>
                      <option>System Lockdown (Manual Only)</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Attachment Protocol</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="p-5 bg-primary text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30">Active: PDF/PNG/JPG</div>
                      <div className="p-5 bg-gray-50 text-gray-300 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-gray-200">DOCX Shield Active</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="hidden md:flex justify-end mt-12">
            <button onClick={handleSave} className="btn-primary rounded-[2rem] flex items-center gap-3 py-6 px-16 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all text-xs font-black uppercase tracking-[0.4em]">
              <Save size={20} /> Deploy Changes
            </button>
        </div>
    </AdminLayout>
  );
};

export default AdminSettings;
