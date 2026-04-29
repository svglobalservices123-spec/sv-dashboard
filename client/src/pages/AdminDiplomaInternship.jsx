import React, { useEffect, useState } from 'react';
import { getDiplomaInternships, deleteDiplomaInternship, exportDiplomaInternships } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, Eye, Trash2, Users, Calendar, Filter, RefreshCw, FileSpreadsheet, MapPin, Briefcase, Phone, Globe, Plus } from 'lucide-react';


const AdminDiplomaInternship = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ course: 'all', city: 'all', state: 'all' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDiplomaInternships();
      setApplications(res.data);
    } catch (error) {
      toast.error('Failed to load internship applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application permanently?')) return;
    try {
      await deleteDiplomaInternship(id);
      toast.success('Application deleted.');
      fetchData();
    } catch { toast.error('Delete failed.'); }
  };

  const handleExport = async () => {
    try {
      toast.loading('Preparing download...');
      const response = await exportDiplomaInternships(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Diploma_Internship_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.dismiss();
      toast.success('Excel downloaded successfully.');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export data.');
    }
  };

  const filtered = applications.filter(app => {
    const matchesSearch = 
      app.studentFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentPhone.includes(searchTerm) || 
      (app.collegeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filters.course === 'all' || app.course === filters.course;
    const matchesCity = filters.city === 'all' || (app.city || '').toLowerCase() === filters.city.toLowerCase();
    const matchesState = filters.state === 'all' || (app.state || '') === filters.state;
    
    return matchesSearch && matchesCourse && matchesCity && matchesState;
  });

  // Get unique cities and courses for filters
  const cities = ['all', ...new Set(applications.map(a => a.city).filter(Boolean))];
  const courses = ['all', ...new Set(applications.map(a => a.course).filter(Boolean))];

  return (
    <AdminLayout title={<>Diploma <span className="text-secondary not-italic uppercase">Internship</span></>} subtitle="Manage specialized diploma internship applications">
        {/* Filters Panel */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
          <div className="relative w-full xl:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, phone, college, city..." className="input-field pl-12 py-4 bg-muted/50 border-transparent focus:bg-white focus:border-primary text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 flex-1 xl:flex-none">
                <Filter size={16} className="text-gray-400 hidden sm:block" />
                <select value={filters.course} onChange={(e) => setFilters({...filters, course: e.target.value})} className="input-field py-4 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer bg-muted/50 border-transparent focus:bg-white focus:border-primary">
                    <option value="all">All Courses</option>
                    {courses.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            
            <select value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} className="input-field py-4 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer flex-1 xl:w-40 xl:flex-none bg-muted/50 border-transparent focus:bg-white focus:border-primary">
              <option value="all">All Cities</option>
              {cities.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value})} className="input-field py-4 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer flex-1 xl:w-40 xl:flex-none bg-muted/50 border-transparent focus:bg-white focus:border-primary">
              <option value="all">All States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={fetchData} className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-blue-500/10" title="Refresh">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => navigate('/admin/diploma-internship/add')} className="flex items-center gap-3 px-8 py-4 bg-secondary text-white rounded-2xl hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-secondary/20">
                  <Plus size={18} /> Manual Enrollment
                </button>
                <button 
                  onClick={handleExport} 
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-500/20 flex-1 sm:flex-none group"
                >
                  <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Export Excel</span>
                </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden group">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Training</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applied Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                        <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Loading Applications...</span>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" className="px-8 py-20 text-center">
                     <div className="text-gray-300 italic font-medium">No applications found matching filters.</div>
                  </td></tr>
                ) : filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-primary/5 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg group-hover/row:scale-110 transition-transform">
                          {app.studentFullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-dark text-base tracking-tight truncate">{app.studentFullName}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Phone size={10} className="text-primary" />
                             <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{app.studentPhone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-secondary" />
                            <p className="text-[11px] font-black text-dark uppercase tracking-tight">{app.collegeName}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{app.branch}</p>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                            <Globe size={12} className="text-emerald-500" />
                            <p className="text-[11px] font-black text-dark uppercase tracking-tight">{app.state || 'N/A'}</p>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                            <Briefcase size={12} className="text-primary" />
                            <p className="text-[11px] font-black text-dark uppercase tracking-tight">{app.course || 'N/A'}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{app.trainingMode}</p>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-500">
                           <Calendar size={12} />
                           <span className="text-[11px] font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/diploma-internship/${app._id}`} className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"><Eye size={18} /></Link>
                        <button onClick={() => handleDelete(app._id)} className="p-3 bg-secondary/5 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
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

export default AdminDiplomaInternship;
