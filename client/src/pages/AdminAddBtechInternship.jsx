import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { submitBtechInternship } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import {
  User, Mail, Phone, Calendar, Users, Fingerprint,
  GraduationCap, Briefcase, Send, Loader2, Globe
} from 'lucide-react';

const AdminAddBtechInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: '', studentFullName: '', studentPhone: '', parentPhone: '', gender: '', dob: '',
    fatherName: '', motherName: '', age: '', caste: '', aadharNumber: '', sscHallTicket: '',
    state: '',
    collegeName: '', branch: '', rollNumber: '', degreePercentage: '',
    trainingMode: '', companyName: '', course: '',
    declaration: true
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));

      await submitBtechInternship(data);
      toast.success('Btech Internship record added!');
      navigate('/admin/btech-internship');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add record.');
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ icon, title }) => (
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 mb-6">
      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">{icon}</span>
      {title}
    </h3>
  );

  const InputField = ({ label, name, type = "text", placeholder, required = true, options = null }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label} {required && '*'}</label>
      {options ? (
        <select name={name} value={formData[name]} onChange={handleInputChange} required={required} className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-emerald-500 cursor-pointer">
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={formData[name]} onChange={handleInputChange} required={required} className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-emerald-500" placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <AdminLayout title="Manual Enrollment" subtitle="Add degree internship application manually">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-6xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 space-y-12">

          <section>
            <SectionTitle icon={<User size={16} />} title="Basic Identification" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField label="Student Email" name="studentEmail" type="email" placeholder="student@gmail.com" />
              <InputField label="Full Name" name="studentFullName" placeholder="e.g. Rahul Sharma" />
              <InputField label="Gender" name="gender" options={["Male", "Female", "Other"]} />
              <InputField label="Date of Birth" name="dob" type="date" />
              <InputField label="Student Phone" name="studentPhone" placeholder="+91 XXXXX XXXXX" />
              <InputField label="Parent Phone" name="parentPhone" placeholder="+91 XXXXX XXXXX" />
            </div>
          </section>

          <section>
            <SectionTitle icon={<Globe size={16} />} title="Personal Background" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField label="Father Name" name="fatherName" placeholder="Father's Name" />
              <InputField label="Mother Name" name="motherName" placeholder="Mother's Name" required={false} />
              <InputField label="Age" name="age" type="number" placeholder="21" />
              <InputField label="Caste" name="caste" placeholder="e.g. OBC" />
              <InputField label="Aadhar Number" name="aadharNumber" placeholder="XXXX XXXX XXXX" />
              <InputField label="SSC Hall Ticket" name="sscHallTicket" placeholder="SSC Roll No" required={false} />
              <InputField label="State" name="state" options={["Telangana", "Andhra Pradesh", "Tamil Nadu"]} />
            </div>
          </section>

          <section>
            <SectionTitle icon={<GraduationCap size={16} />} title="Academic Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField label="College Name" name="collegeName" placeholder="Full College Name" />
              <InputField label="Branch" name="branch" placeholder="e.g. ECE" />
              <InputField label="Roll Number" name="rollNumber" placeholder="Univ Roll No" />
              <InputField label="Degree Percentage (%)" name="degreePercentage" placeholder="e.g. 75%" />
            </div>
          </section>

          <section>
            <SectionTitle icon={<Briefcase size={16} />} title="Training Preferences" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Training Mode" name="trainingMode" options={["OJT", "In Hands Training", "Other"]} />
              <InputField label="Target Course" name="course" options={["Java / Python", "AI / ML / Cyber Security", "Cloud Computing / Networking", "Embedded Systems / PCB", "CSE"]} required={formData.trainingMode === 'In Hands Training'} />
              <InputField label="Company Name" name="companyName" placeholder="Optional" required={false} />
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={loading} className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-emerald-600 text-white rounded-2xl hover:scale-[1.02] active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 disabled:opacity-50">
              {loading ? <><Loader2 className="animate-spin" size={18} /> Authorizing Entry...</> : <><Send size={18} /> Register Application</>}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminAddBtechInternship;
