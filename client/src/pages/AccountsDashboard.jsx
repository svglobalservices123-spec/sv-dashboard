import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import FeeReceiptModal from '../components/FeeReceiptModal';

const AccountsDashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, totalAmount: 0 });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    collegeName: '',
    branch: '',
    name: ''
  });
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.collegeName) params.append('collegeName', filters.collegeName);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.name) params.append('name', filters.name);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fee-receipt?${params.toString()}`);
      setReceipts(response.data.data);
      setStats({
        count: response.data.count,
        totalAmount: response.data.totalAmount
      });
    } catch (error) {
      toast.error('Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [filters]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.collegeName) params.append('collegeName', filters.collegeName);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.name) params.append('name', filters.name);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fee-receipt/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fee_receipts_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/fee-receipt/${id}`);
        toast.success('Receipt deleted successfully');
        fetchReceipts(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete receipt');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAccountsAdmin');
    navigate('/accounts-login');
  };

  const openReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Inter']">
      {/* Sidebar/Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
              alt="SVGS" 
              className="h-10"
            />
            <div className="h-6 w-[1px] bg-gray-300 hidden md:block"></div>
            <h1 className="text-xl font-black text-blue-900 hidden md:block tracking-tight">Accounts Portal</h1>
          </div>
          <div className="flex gap-3">
             <Link 
              to="/accounts-receipt/new" 
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-blue-900/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              New Receipt
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-bold text-sm transition-all border border-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-blue-900" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total Receipts</p>
            <h3 className="text-3xl font-black text-blue-900">{stats.count}</h3>
            <div className="mt-4 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-700 w-2/3"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group col-span-1 md:col-span-2">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform text-red-600">
               <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total Collection</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-gray-400">INR</span>
              <h3 className="text-4xl font-black text-blue-900">₹{stats.totalAmount.toLocaleString()}</h3>
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              Live collection data from SVGS database
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 flex-1 w-full">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Student Name</label>
                <input 
                  type="text" 
                  placeholder="Ex: John Doe"
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Start Date</label>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">End Date</label>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">College</label>
                <input 
                  type="text" 
                  placeholder="Ex: SVCE"
                  value={filters.collegeName}
                  onChange={(e) => setFilters({...filters, collegeName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Branch</label>
                <input 
                  type="text" 
                  placeholder="Ex: CSE"
                  value={filters.branch}
                  onChange={(e) => setFilters({...filters, branch: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>
            </div>
            <button 
              onClick={handleExport}
              className="w-full lg:w-auto px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Information</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">College & Branch</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Syncing Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : receipts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium">No records found matching filters</td>
                  </tr>
                ) : (
                  receipts.map((r) => (
                    <tr key={r._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-gray-900">{new Date(r.date).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-blue-900 uppercase tracking-tight">{r.name}</span>
                          <span className="text-[11px] text-gray-400 font-bold">{r.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-black text-slate-500 bg-gray-100 px-2.5 py-1 rounded-md">{r.rollNumber}</span>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-700">{r.collegeName}</span>
                          <span className="text-[10px] text-red-600 font-black uppercase tracking-tighter">{r.branch}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-blue-900">₹{(r.paidFee !== undefined ? r.paidFee : r.amount).toLocaleString()}</span>
                          {r.due !== undefined && r.due > 0 && (
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-tighter mt-0.5">Due: ₹{r.due.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openReceipt(r)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white rounded-lg font-bold text-xs transition-all border border-blue-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                            Print
                          </button>
                          <Link 
                            to={`/accounts-receipt/edit/${r._id}`}
                            className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-lg font-bold text-xs transition-all border border-amber-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(r._id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white rounded-lg font-bold text-xs transition-all border border-red-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && selectedReceipt && (
        <FeeReceiptModal 
          receipt={selectedReceipt} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AccountsDashboard;
