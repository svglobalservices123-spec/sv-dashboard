import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudent, getDashboardStats, exportStudents } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Eye, Trash2, Users, IndianRupee, Clock, RefreshCw, FileSpreadsheet } from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalPayments: 0, pendingPayments: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, statsRes] = await Promise.all([getAllStudents(), getDashboardStats()]);
      setStudents(studentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted.');
      fetchData();
    } catch { toast.error('Delete failed.'); }
  };

  const handleExport = async () => {
    try {
      toast.loading('Preparing download...');
      const response = await exportStudents(filterStatus);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Students_${filterStatus}_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.dismiss();
      toast.success('Excel downloaded successfully.');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export students.');
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) || (s.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || s.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${color} group-hover:scale-110 transition-all shadow-sm`}>{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="text-3xl font-black text-dark mt-1 tracking-tighter">{value}</p>
      <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-all duration-500`}>{icon}</div>
    </div>
  );

  return (
    <AdminLayout title={<>Admin <span className="text-secondary not-italic">Dashboard</span></>} subtitle="Manage enrollments and real-time payments">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          <StatCard icon={<Users size={24} className="text-primary" />} label="Total Students" value={stats.totalStudents} color="bg-primary/5" />
          <StatCard icon={<IndianRupee size={24} className="text-green-600" />} label="Paid Payments" value={stats.totalPayments} color="bg-green-50" />
          <StatCard icon={<Clock size={24} className="text-amber-600" />} label="Pending" value={stats.pendingPayments} color="bg-amber-50" />
          <StatCard icon={<IndianRupee size={24} className="text-secondary" />} label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="bg-secondary/5" />
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
          <div className="relative w-full xl:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, phone, city..." className="input-field pl-12 py-4 bg-muted/50 border-transparent focus:bg-white focus:border-primary text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field py-4 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer flex-1 xl:w-48 xl:flex-none bg-muted/50 border-transparent focus:bg-white focus:border-primary">
              <option value="all">All Status</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
            </select>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={fetchData} className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-blue-500/10 flex-shrink-0" title="Refresh">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <button 
                  onClick={handleExport} 
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-500/20 flex-1 sm:flex-none group"
                >
                  <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Download Registry</span>
                </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden group">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Profile</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Payment System</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                        <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Synchronizing Registry...</span>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center">
                     <div className="text-gray-300 italic font-medium">No records found matching your current filter parameters.</div>
                  </td></tr>
                ) : filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-primary/5 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg group-hover/row:scale-110 transition-transform">
                          {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-dark text-base tracking-tight truncate">{s.name}</p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider truncate">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-700 font-mono tracking-tighter">{s.phone}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">{s.city || 'GLOBAL GATEWAY'}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${s.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-200' : 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/student/${s._id}`} className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"><Eye size={18} /></Link>
                        <button onClick={() => handleDelete(s._id)} className="p-3 bg-secondary/5 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
