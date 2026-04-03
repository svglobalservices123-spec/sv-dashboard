import React, { useEffect, useState } from 'react';
import { getAllStudents, deleteStudent, getDashboardStats, exportStudents } from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Eye, Trash2, Users, IndianRupee, Clock, RefreshCw, Download, FileSpreadsheet, Menu } from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalPayments: 0, pendingPayments: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    const nameMatch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (s.phone || '').includes(searchTerm);
    const cityMatch = (s.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || phoneMatch || cityMatch;
    const matchesFilter = filterStatus === 'all' || s.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group`}>
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-all`}>{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-2xl md:text-3xl font-black text-dark mt-1">{value}</p>
    </div>
  );

  return (
    <div className="flex bg-muted min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-xl font-display font-black text-dark tracking-tighter">SV <span className="text-secondary">ADMIN</span></h2>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-primary/5 text-primary rounded-xl">
            <Menu size={24} />
          </button>
        </div>

        <header className="mb-8 hidden md:block">
          <h1 className="text-3xl font-display font-black text-dark tracking-tighter">Admin <span className="text-secondary">Dashboard</span></h1>
          <p className="text-gray-400 text-sm mt-1">Manage enrollments and payments</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <StatCard icon={<Users size={24} className="text-primary" />} label="Total Students" value={stats.totalStudents} color="bg-primary/5" />
          <StatCard icon={<IndianRupee size={24} className="text-green-600" />} label="Paid Payments" value={stats.totalPayments} color="bg-green-50" />
          <StatCard icon={<Clock size={24} className="text-amber-600" />} label="Pending" value={stats.pendingPayments} color="bg-amber-50" />
          <StatCard icon={<IndianRupee size={24} className="text-secondary" />} label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="bg-secondary/5" />
        </div>

        {/* Filters */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, city..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="flex-1 md:flex-none md:w-44 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <button 
              onClick={fetchData} 
              className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm" 
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleExport} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-200"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">Data is loading smoothly...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Oops! No matches found.</td></tr>
                ) : filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">{s.name ? s.name.charAt(0) : '?'}</div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{s.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{s.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{s.city || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/student/${s._id}`} className="p-2.5 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm" title="View Details"><Eye size={16} /></Link>
                        <button onClick={() => handleDelete(s._id)} className="p-2.5 bg-secondary/5 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all shadow-sm" title="Delete Records"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Footer Hinweis */}
          <div className="md:hidden p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
            Swipe left to see more columns
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
