import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FeeReceiptForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    phone: '',
    collegeName: '',
    purpose: '',
    paymentMode: 'Online',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/fee-receipt`, formData);
      toast.success('Receipt generated successfully');
      navigate('/accounts-dashboard');
    } catch (error) {
      toast.error('Failed to create receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-['Inter'] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/accounts-dashboard')}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </button>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">Create Fee Receipt</h2>
            <p className="text-blue-100 mt-1 opacity-80">Fill in the student details to generate a new receipt</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Student Details</h3>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Roll Number</label>
                  <input 
                    type="text" name="rollNumber" required value={formData.rollNumber} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Branch</label>
                  <input 
                    type="text" name="branch" required value={formData.branch} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
                  <input 
                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Payment Details</h3>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">College Name</label>
                  <input 
                    type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Purpose to Pay</label>
                  <input 
                    type="text" name="purpose" required value={formData.purpose} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Amount (₹)</label>
                    <input 
                      type="number" name="amount" required value={formData.amount} onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                    <input 
                      type="date" name="date" required value={formData.date} onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Mode of Payment</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-lg border border-slate-700 flex-1 hover:bg-slate-700 transition-colors">
                      <input 
                        type="radio" name="paymentMode" value="Online" checked={formData.paymentMode === 'Online'} onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span>Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-lg border border-slate-700 flex-1 hover:bg-slate-700 transition-colors">
                      <input 
                        type="radio" name="paymentMode" value="Cash" checked={formData.paymentMode === 'Cash'} onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span>Cash</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Generate and Save Receipt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptForm;
