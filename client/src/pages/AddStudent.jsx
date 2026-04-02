import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createStudent, uploadDocuments, savePayment } from '../utils/api';
import Sidebar from '../components/Sidebar';
import { User, ShieldCheck, GraduationCap, MapPin, Building, Send, Loader2, CreditCard, X, FileUp } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', branch: '',
    rollNumber: '', collegeName: '', location: '', course: '',
    paymentAmount: '520', paymentStatus: 'Paid'
  });
  const [loading, setLoading] = useState(false);

  const courses = [
    'AI',
    'IOT & CYBERSECURITY',
    'VLSI & PCB',
    'WEB TECHNOLOGIES'
  ];

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Student
      const res1 = await createStudent({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        branch: formData.branch,
        rollNumber: formData.rollNumber,
        collegeName: formData.collegeName,
        location: formData.location,
        course: formData.course,
      });
      const studentId = res1.data.studentId;

      // 2. Save Payment (Optional)
      if (formData.paymentAmount) {
        await savePayment(studentId, {
          amount: formData.paymentAmount,
          status: formData.paymentStatus,
          paymentMethod: 'Manual Entry',
          transactionId: `ADMIN-${Date.now()}`
        });
      }

      toast.success('Student added successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-muted min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-black text-dark tracking-tighter">Register New <span className="text-secondary">Student</span></h1>
          <p className="text-gray-400 text-sm mt-1">Manual enrollment portal for administrators</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 space-y-10 max-w-4xl">
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <User size={16} /> Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field py-3" placeholder="Enter name" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="input-field py-3" placeholder="Enter phone" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email ID</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field py-3" placeholder="Enter email" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Course</label>
                <select name="course" value={formData.course} onChange={handleInputChange} required className="input-field py-3 cursor-pointer">
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Branch</label><input type="text" name="branch" value={formData.branch} onChange={handleInputChange} required className="input-field py-3" placeholder="e.g. CSE" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Roll Number</label><input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required className="input-field py-3" placeholder="Univ Roll No" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">College Name</label><input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} required className="input-field py-3" placeholder="University" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="input-field py-3" placeholder="City" /></div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-dark flex items-center gap-2">
              <CreditCard size={16} /> Payment Entry (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted p-6 rounded-2xl border border-gray-100">
               <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Paid Amount (₹)</label><input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleInputChange} className="input-field py-3" placeholder="520" /></div>
               <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Payment Status</label>
                 <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="input-field py-3 cursor-pointer"><option value="Paid">Paid</option><option value="Pending">Pending</option></select>
               </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-xl flex items-center justify-center gap-4 disabled:opacity-50">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><Send size={18} /> Add Student to Registry</>}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddStudent;
