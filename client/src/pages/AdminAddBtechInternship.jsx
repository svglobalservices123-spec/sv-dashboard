import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { submitBtechInternship } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import {
  User, Mail, Phone, Calendar, Users, Fingerprint,
  GraduationCap, Briefcase, Send, Loader2, Globe, FileText, Upload
} from 'lucide-react';

const SectionTitle = ({ icon, title }) => (
  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 mb-6">
    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">{icon}</span>
    {title}
  </h3>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder, required = true, options = null }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label} {required && '*'}</label>
    {options ? (
      <select name={name} value={value} onChange={onChange} required={required} className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-emerald-500 cursor-pointer">
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} required={required} className="input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-emerald-500" placeholder={placeholder} />
    )}
  </div>
);

const FileField = ({ label, name, onChange, required = false }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label} {required && '*'}</label>
    <div className="relative group">
      <input 
        type="file" 
        name={name} 
        onChange={onChange} 
        required={required} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
      />
      <div className="flex items-center gap-4 py-4 px-6 bg-muted/30 border-2 border-dashed border-gray-200 rounded-2xl group-hover:border-emerald-500/50 group-hover:bg-white transition-all">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-500 shadow-sm transition-colors">
          <Upload size={18} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-bold text-gray-500 truncate group-hover:text-dark">Click or Drag to upload</p>
          <p className="text-[10px] text-gray-400 font-medium">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminAddBtechInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: '', studentFullName: '', studentPhone: '', parentPhone: '', gender: '', dob: '',
    fatherName: '', motherName: '', age: '', caste: '', aadharNumber: '', sscHallTicket: '',
    state: '',
    collegeName: '', branch: '', rollNumber: '', degreePercentage: '',
    trainingMode: '', companyName: '', course: '', city: '',
    declaration: true
  });
  const [files, setFiles] = useState({
    collegeIdCard: null,
    aadharCard: null,
    sscMemo: null,
    photo: null
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      Object.keys(files).forEach(key => {
        if (files[key]) data.append(key, files[key]);
      });

      await submitBtechInternship(data);
      toast.success('Btech Internship record added!');
      navigate('/admin/btech-internship');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Manual Enrollment" subtitle="Add degree internship application manually">
      <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-6xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 space-y-12">

          <section>
            <SectionTitle icon={<User size={16} />} title="Basic Identification" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField label="Student Email" name="studentEmail" value={formData.studentEmail} onChange={handleInputChange} type="email" placeholder="student@gmail.com" />
              <InputField label="Full Name" name="studentFullName" value={formData.studentFullName} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" />
              <InputField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={["Male", "Female", "Other"]} />
              <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} type="date" />
              <InputField label="Student Phone" name="studentPhone" value={formData.studentPhone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" />
              <InputField label="Parent Phone" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" />
              <InputField label="City / Location" name="city" value={formData.city} onChange={handleInputChange} options={["Hyderabad", "Bangalore", "Chennai", "Sri City (Anantapur)", "Tirupati"]} />
            </div>
          </section>

          <section>
            <SectionTitle icon={<Globe size={16} />} title="Personal Background" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Father's Name" />
              <InputField label="Mother Name" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Mother's Name" required={false} />
              <InputField label="Age" name="age" value={formData.age} onChange={handleInputChange} type="number" placeholder="21" />
              <InputField label="Caste" name="caste" value={formData.caste} onChange={handleInputChange} placeholder="e.g. OBC" />
              <InputField label="Aadhar Number" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} placeholder="XXXX XXXX XXXX" />
              <InputField label="SSC Hall Ticket" name="sscHallTicket" value={formData.sscHallTicket} onChange={handleInputChange} placeholder="SSC Roll No" required={false} />
              <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} options={["Telangana", "Andhra Pradesh", "Tamil Nadu"]} />
            </div>
          </section>

          <section>
            <SectionTitle icon={<GraduationCap size={16} />} title="Academic Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField label="College Name" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="Full College Name" />
              <InputField label="Branch" name="branch" value={formData.branch} onChange={handleInputChange} options={[
                "Computer Science Engineering (CSE)",
                "Information Technology (IT)",
                "Artificial Intelligence (AI)",
                "Artificial Intelligence & Machine Learning (AI-ML)",
                "Data Science",
                "Cyber Security",
                "Electronics & Communication Engineering (ECE)",
                "Electrical & Electronics Engineering (EEE)",
                "Mechanical Engineering (ME)",
                "Civil Engineering (CE)",
                "others"
              ]} />
              <InputField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} placeholder="Univ Roll No" />
              <InputField label="Degree Percentage (%)" name="degreePercentage" value={formData.degreePercentage} onChange={handleInputChange} placeholder="e.g. 75%" />
            </div>
          </section>

          <section>
            <SectionTitle icon={<Briefcase size={16} />} title="Training Preferences" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Training Mode" name="trainingMode" value={formData.trainingMode} onChange={handleInputChange} options={[
                { value: "OJT", label: "1. OJT- ON JOB TRAINING[Stipend ]" },
                { value: "In Hands Training", label: "2. IN HANDS TRAINING [NO Stipend paid ]" }
              ]} />
              <InputField label="Target Course" name="course" value={formData.course} onChange={handleInputChange} options={[
                "C", "Java", "Python", "Full Stack Development", "AI", "Machine Learning", "Cyber Security", "IoT", "Robotics", 
                "Cloud Computing", "Networking", "AWS", "DevOps", "5G Technologies", "Embedded Systems", "PCB Design", 
                "Solar Design", "VLSI", "MATLAB", "Arduino", "Raspberry Pi", "EMS", "NDT Tools Design", "CNC Programming", 
                "AutoCAD", "SketchUp", "Revit", "Site Engineering", "Quantity Survey", "Advanced Survey", "Other"
              ]} required={formData.trainingMode === 'In Hands Training'} />
              <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Optional" required={false} />
            </div>
          </section>

          <section>
            <SectionTitle icon={<FileText size={16} />} title="Document Vault (Optional)" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FileField label="College ID Card" name="collegeIdCard" onChange={handleFileChange} />
              <FileField label="Aadhar Card" name="aadharCard" onChange={handleFileChange} />
              <FileField label="SSC Memo" name="sscMemo" onChange={handleFileChange} />
              <FileField label="Student Photo" name="photo" onChange={handleFileChange} />
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
