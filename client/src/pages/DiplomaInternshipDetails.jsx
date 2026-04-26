import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDiplomaInternshipDetails, deleteDiplomaInternship } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, Calendar, Users, Fingerprint, 
  GraduationCap, Briefcase, FileText, ExternalLink, 
  Trash2, ChevronLeft, Loader2, MapPin, CheckCircle
} from 'lucide-react';


const DiplomaInternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getDiplomaInternshipDetails(id);
        setApp(res.data);
      } catch (error) {
        toast.error('Failed to load application details.');
        navigate('/admin/diploma-internship');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this application permanently?')) return;
    try {
      await deleteDiplomaInternship(id);
      toast.success('Application deleted.');
      navigate('/admin/diploma-internship');
    } catch { toast.error('Delete failed.'); }
  };

  if (loading) return (
    <AdminLayout title="Loading..." subtitle="Synchronizing record details">
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Accessing Secure Database...</p>
      </div>
    </AdminLayout>
  );

  if (!app) return null;

  const DetailSection = ({ title, icon, children }) => (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 md:p-10 space-y-8 h-full">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</span>
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-y-6">
        {children}
      </div>
    </div>
  );

  const DetailItem = ({ label, value, icon, isDark = false }) => (
    <div className="group">
      <p className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-1 group-hover:text-primary transition-colors flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {icon} {label}
      </p>
      <p className={`text-sm font-black tracking-tight break-words ${isDark ? 'text-white' : 'text-dark'}`}>{value || 'N/A'}</p>
    </div>
  );


  const DocumentCard = ({ label, doc }) => (
    <div className="bg-muted/50 p-6 rounded-3xl border border-gray-100 hover:border-primary/30 transition-all group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
          <p className="text-xs font-bold text-dark">Document Ready</p>
        </div>
      </div>
      <a 
        href={doc?.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="p-3 bg-primary text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
      >
        <ExternalLink size={16} />
      </a>
    </div>
  );

  return (
    <AdminLayout title={<>Intern <span className="text-secondary not-italic">Profile</span></>} subtitle="Detailed administrative view of internship application">
      <div className="space-y-10 pb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <button onClick={() => navigate('/admin/diploma-internship')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all">
            <ChevronLeft size={16} /> Back to Registry
          </button>
          <button onClick={handleDelete} className="flex items-center gap-3 px-8 py-4 bg-secondary/10 text-secondary rounded-2xl hover:bg-secondary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/10">
            <Trash2 size={16} /> Terminate Record
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Identity */}
          <DetailSection title="Basic Identity" icon={<User size={16} />}>
            <DetailItem label="Full Name" value={app.studentFullName} icon={<User size={10} />} />
            <DetailItem label="Official Email" value={app.studentEmail} icon={<Mail size={10} />} />
            <DetailItem label="Contact Number" value={app.studentPhone} icon={<Phone size={10} />} />
            <DetailItem label="Parent Contact" value={app.parentPhone} icon={<Phone size={10} />} />
            <DetailItem label="Gender" value={app.gender} icon={<Users size={10} />} />
            <DetailItem label="Date of Birth" value={app.dob} icon={<Calendar size={10} />} />
            <DetailItem label="Location / City" value={app.city} icon={<MapPin size={10} />} />
          </DetailSection>

          {/* Column 2: Academic */}
          <DetailSection title="Academic Profile" icon={<GraduationCap size={16} />}>
            <DetailItem label="University / College" value={app.collegeName} icon={<MapPin size={10} />} />
            <DetailItem label="Branch / Stream" value={app.branch} icon={<GraduationCap size={10} />} />
            <DetailItem label="Identity (Roll No)" value={app.rollNumber} icon={<Fingerprint size={10} />} />
            <DetailItem label="Academic Performance (GPA)" value={app.gpa} icon={<CheckCircle size={10} />} />
            <div className="pt-4 border-t border-gray-50 mt-4">
                <DetailItem label="Father Name" value={app.fatherName} icon={<User size={10} />} />
                <DetailItem label="Aadhar Number" value={app.aadharNumber} icon={<Fingerprint size={10} />} />
            </div>
          </DetailSection>

          {/* Column 3: Training & Docs */}
          <div className="space-y-8">
            <div className="bg-dark rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-3 mb-8">
                    <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center"><Briefcase size={16} /></span>
                    Training Parameters
                </h3>
                <div className="space-y-6">
                    <DetailItem label="Mode of Training" value={app.trainingMode} icon={<Briefcase size={10} className="text-secondary" />} isDark={true} />
                    <DetailItem label="Target Course" value={app.course} icon={<GraduationCap size={10} className="text-secondary" />} isDark={true} />
                    <DetailItem label="Company Name" value={app.companyName} icon={<Briefcase size={10} className="text-secondary" />} isDark={true} />
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Registration Date</p>
                    <p className="text-lg font-display font-black italic">{new Date(app.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-dark flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><FileText size={16} /></span>
                    Document Vault
                </h3>
                <DocumentCard label="College ID / Bonafide" doc={app.collegeIdCard} />
                <DocumentCard label="Aadhar Card" doc={app.aadharCard} />
                <DocumentCard label="SSC Memo" doc={app.sscMemo} />
                <DocumentCard label="Student Photo" doc={app.photo} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DiplomaInternshipDetails;
