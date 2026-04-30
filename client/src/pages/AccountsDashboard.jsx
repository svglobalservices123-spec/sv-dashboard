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
    branch: ''
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fee-receipt/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fee_receipts.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export failed');
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
    <div className="min-h-screen bg-slate-950 text-white font-['Inter'] p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Fee Receipt Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and generate student fee receipts</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/accounts-receipt/new" 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            New Receipt
          </Link>
          <button 
            onClick={handleExport}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-all flex items-center gap-2 border border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export Excel
          </button>
          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg font-semibold transition-all border border-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Receipts</p>
          <h3 className="text-4xl font-bold">{stats.count}</h3>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Amount Collected</p>
          <h3 className="text-4xl font-bold text-green-400">₹{stats.totalAmount.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          Filters
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Start Date</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">End Date</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">College</label>
            <input 
              type="text" 
              placeholder="Search college..."
              value={filters.collegeName}
              onChange={(e) => setFilters({...filters, collegeName: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Branch</label>
            <input 
              type="text" 
              placeholder="Search branch..."
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Roll No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">College</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading receipts...</td>
                </tr>
              ) : receipts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No receipts found</td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold">{r.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.rollNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.collegeName}</td>
                    <td className="px-6 py-4 font-bold text-green-400">₹{r.amount}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openReceipt(r)}
                        className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors"
                        title="View Receipt"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
