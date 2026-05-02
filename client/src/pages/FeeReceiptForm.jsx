import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const FeeReceiptForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    phone: '',
    collegeName: '',
    purpose: '',
    paymentMode: 'Online',
    paidFee: '',
    due: '',
    totalFee: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchReceipt = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/fee-receipt/${id}`);
          const data = res.data.data;
          if (data.date) data.date = new Date(data.date).toISOString().split('T')[0];
          
          setFormData({
            name: data.name || '',
            rollNumber: data.rollNumber || '',
            branch: data.branch || '',
            phone: data.phone || '',
            collegeName: data.collegeName || '',
            purpose: data.purpose || '',
            paymentMode: data.paymentMode || 'Online',
            paidFee: data.paidFee !== undefined ? data.paidFee.toString() : (data.amount || '').toString(),
            due: data.due !== undefined ? data.due.toString() : '',
            totalFee: data.totalFee !== undefined ? data.totalFee.toString() : (data.amount || '').toString(),
            date: data.date || new Date().toISOString().split('T')[0]
          });
        } catch (error) {
          toast.error('Failed to load receipt details');
        }
      };
      fetchReceipt();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate Total Fee if Paid Fee and Due are present
      if (name === 'paidFee' || name === 'due') {
        const paid = parseFloat(updated.paidFee) || 0;
        const dueAmt = parseFloat(updated.due) || 0;
        updated.totalFee = (paid + dueAmt).toString();
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        amount: formData.paidFee // For backward compatibility
      };
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/fee-receipt/${id}`, dataToSubmit);
        toast.success('Receipt updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/fee-receipt`, dataToSubmit);
        toast.success('Receipt generated successfully');
      }
      navigate('/accounts-dashboard');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} receipt`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Inter']">
       {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/accounts-dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-900 transition-colors font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Return to Dashboard
          </button>
          <img 
            src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
            alt="SVGS" 
            className="h-8"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-blue-900 p-8 md:p-10 text-center relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">{isEdit ? 'Update Fee Receipt' : 'Student Fee Receipt Form'}</h2>
            <p className="text-blue-200 text-sm font-medium">Internal System - SV Global Services</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            {/* Section 1: Student Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center font-black text-xs">01</div>
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Student Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    placeholder="Enter student's full name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Roll Number</label>
                  <input 
                    type="text" name="rollNumber" required value={formData.rollNumber} onChange={handleChange}
                    placeholder="Ex: 21XXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Academic Branch</label>
                  <input 
                    type="text" name="branch" required value={formData.branch} onChange={handleChange}
                    placeholder="Ex: CSE / ECE"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                  <input 
                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    placeholder="Ex: 9876543210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-black text-xs">02</div>
                <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Payment Transaction</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">College Name</label>
                  <input 
                    type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange}
                    placeholder="Enter full college name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Purpose of Payment</label>
                  <input 
                    type="text" name="purpose" required value={formData.purpose} onChange={handleChange}
                    placeholder="Ex: Internship Fee / Registration Fee"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Transaction Date</label>
                  <input 
                    type="date" name="date" required value={formData.date} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Method of Payment</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all font-bold text-sm ${formData.paymentMode === 'Online' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      <input 
                        type="radio" name="paymentMode" value="Online" checked={formData.paymentMode === 'Online'} onChange={handleChange}
                        className="hidden"
                      />
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      Online
                    </label>
                    <label className={`flex items-center justify-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all font-bold text-sm ${formData.paymentMode === 'Cash' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      <input 
                        type="radio" name="paymentMode" value="Cash" checked={formData.paymentMode === 'Cash'} onChange={handleChange}
                        className="hidden"
                      />
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      Cash
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Paid Fee (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">₹</span>
                    <input 
                      type="number" name="paidFee" required value={formData.paidFee} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-black text-blue-900"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Due (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">₹</span>
                    <input 
                      type="number" name="due" required value={formData.due} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-black text-blue-900"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Total Fee (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">₹</span>
                    <input 
                      type="number" name="totalFee" required value={formData.totalFee} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all font-black text-blue-900"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer / Submit */}
            <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-3 max-w-sm">
                <svg className="w-6 h-6 text-red-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-[11px] text-gray-400 font-medium italic">
                  By generating this receipt, the data will be permanently logged in the SVGS internal accounts database for audit purposes.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-10 py-5 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 tracking-widest uppercase text-xs ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : (isEdit ? 'Update Receipt' : 'Generate Receipt')}
                {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptForm;
