import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createStudent, savePayment } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { User, Send, Loader2, CreditCard } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', branch: '',
    rollNumber: '', collegeName: '', location: '', course: '',
    courseType: '', year: '',
    paymentAmount: '589', paymentStatus: 'Paid'
  });
  const [loading, setLoading] = useState(false);

  const courses = [
    'AI',
    'IOT & CYBERSECURITY',
    'VLSI & PCB',
    'WEB TECHNOLOGIES'
  ];
  const courseTypes = ['Diploma', 'B tech', 'Degree', 'Other'];
  const years = ['1st year', '2nd year', '3rd year', '4th year', 'Other'];

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res1 = await createStudent({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        branch: formData.branch,
        rollNumber: formData.rollNumber,
        collegeName: formData.collegeName,
        location: formData.location,
        course: formData.course,
        courseType: formData.courseType,
        year: formData.year,
      });
      const studentId = res1.data.studentId;

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
    <AdminLayout title={<>Register New <span className="text-secondary not-italic uppercase">Student</span></>} subtitle="Manual enrollment portal for administrators">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-12 space-y-12 max-w-5xl">
          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><User size={16} /></span>
              Basic Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Identity</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secure Contact</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Official Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stream of Study</label>
                <select name="course" value={formData.course} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary cursor-pointer">
                  <option value="">Select Target Course</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Department/Branch</label><input type="text" name="branch" value={formData.branch} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="e.g. Computer Science" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity/Roll Number</label><input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="Univ Roll No" /></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Course Type</label>
                <select name="courseType" value={formData.courseType} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary cursor-pointer">
                  <option value="">Select Course</option>
                  {courseTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Year</label>
                <select name="year" value={formData.year} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary cursor-pointer">
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">University/Institution</label><input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="College Name" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Postal Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary" placeholder="City Name" /></div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-dark flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-dark/5 flex items-center justify-center"><CreditCard size={16} /></span>
              Financial Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/50 p-8 rounded-[2rem] border border-gray-100">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Collected Amount (₹)</label>
                  <input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleInputChange} className="input-field py-4 border-transparent focus:bg-white focus:border-primary" placeholder="589" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Transaction Status</label>
                  <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="input-field py-4 border-transparent focus:bg-white focus:border-primary cursor-pointer">
                    <option value="Paid">Verified (Paid)</option>
                    <option value="Pending">Unverified (Pending)</option>
                  </select>
               </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full py-6 text-xs font-black uppercase tracking-[0.5em] rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-blue-500/30">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Registry Syncing...</> : <><Send size={20} /> Authorize & Register Student</>}
          </button>
        </form>
    </AdminLayout>
  );
};

export default AddStudent;
