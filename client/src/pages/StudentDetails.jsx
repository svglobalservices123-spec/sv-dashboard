import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudentDetails, updateStudentStatus, deleteStudent } from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Download, FileText, IndianRupee, CreditCard, Phone, Mail, GraduationCap, MapPin, Building, CheckCircle2, XCircle, Trash2, Loader2, ShieldCheck, BookOpen, Clock } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getStudentDetails(id);
      setData(res.data);
    } catch { toast.error('Failed to load student.'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await updateStudentStatus(id, status);
      setData({ ...data, student: { ...data.student, status } });
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Update failed.'); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this student permanently?')) return;
    try { await deleteStudent(id); toast.success('Deleted.'); navigate('/admin'); }
    catch { toast.error('Delete failed.'); }
  };

  if (loading) return (
    <AdminLayout title="Student Details" subtitle="Loading registry data...">
        <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    </AdminLayout>
  );

  if (!data) return (
    <AdminLayout title="Not Found" subtitle="Requested record is missing">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-400 font-bold">Student record could not be retrieved.</p>
            <Link to="/admin" className="btn-primary flex items-center gap-2 rounded-xl"><ArrowLeft size={16} /> Return to Dashboard</Link>
        </div>
    </AdminLayout>
  );

  const { student, documents, payment } = data;
  const docLabels = { aadhaar: 'Aadhaar Card', marksheet: '10th Marksheet', idcard: 'ID Card', other: 'Document' };

  return (
    <AdminLayout title={<><span className="text-secondary not-italic uppercase">{student.name}</span> Profile</>} subtitle={`System Reference: ${student._id}`}>
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16} /> Back to Registry</Link>
          <div className="flex gap-2 w-full sm:w-auto">
            {student.status === 'Pending' && (<>
              <button disabled={updating} onClick={() => handleStatusUpdate('Approved')} className="flex-1 sm:flex-initial bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"><CheckCircle2 size={16} /> Approve</button>
              <button disabled={updating} onClick={() => handleStatusUpdate('Rejected')} className="flex-1 sm:flex-initial bg-secondary hover:bg-red-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"><XCircle size={16} /> Reject</button>
            </>)}
            <button onClick={handleDelete} className="p-3 bg-gray-50 text-gray-400 hover:text-secondary rounded-2xl border border-gray-100 transition-all active:scale-90 shadow-sm"><Trash2 size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="bg-dark p-8 md:p-12 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse"></div>
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 flex items-center justify-center font-display text-5xl font-black mx-auto mb-6 shadow-2xl backdrop-blur-md">
                  {student.name.charAt(0)}
                </div>
                <h2 className="text-3xl font-black tracking-tight">{student.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${student.status === 'Approved' ? 'bg-green-500 text-white shadow-green-500/30' : student.status === 'Rejected' ? 'bg-secondary text-white shadow-red-500/30' : 'bg-primary text-white shadow-blue-500/30'}`}>{student.status}</span>
                </div>
              </div>
              <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-7">
                <InfoRow icon={<Phone size={18} />} label="Security Contact" value={student.phone} color="text-green-500" />
                <InfoRow icon={<Mail size={18} />} label="Registry Email" value={student.email} color="text-amber-500" />
                <InfoRow icon={<GraduationCap size={18} />} label="Assigned Course" value={student.course} color="text-primary" />
                <InfoRow icon={<BookOpen size={18} />} label="Course Level" value={student.courseType || '—'} color="text-indigo-500" />
                <InfoRow icon={<Clock size={18} />} label="Current Year" value={student.year || '—'} color="text-rose-500" />
                <InfoRow icon={<GraduationCap size={18} />} label="Academic Stream" value={student.branch || '—'} color="text-secondary" />
                <InfoRow icon={<ShieldCheck size={18} />} label="University ID" value={student.rollNumber || '—'} color="text-blue-500" />
                <InfoRow icon={<Building size={18} />} label="Institution" value={student.collegeName || '—'} color="text-purple-500" />
                <InfoRow icon={<MapPin size={18} />} label="Geographic Location" value={student.location || '—'} color="text-orange-500" />
              </div>
            </div>

            {/* Document Registry */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-dark mb-8 flex items-center gap-3"><FileText className="text-primary" size={24} /> Document Repository</h3>
              {documents.length === 0 ? (
                <div className="bg-muted rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold italic">No document records found in high-security storage.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {documents.map((doc, i) => (
                    <div key={i} className="bg-muted/50 rounded-2xl p-6 flex items-center justify-between group hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><FileText size={20} /></div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-dark truncate uppercase tracking-tight">{doc.fileName}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{docLabels[doc.documentType] || doc.documentType}</p>
                        </div>
                      </div>
                      <a href={`${import.meta.env.VITE_API_URL}/${doc.filePath}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white text-gray-400 rounded-xl hover:text-white hover:bg-primary transition-all flex items-center justify-center border border-gray-100 shadow-sm active:scale-90"><Download size={18} /></a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 transition-all group-hover:rotate-0 pointer-events-none text-secondary">
                  <CreditCard size={120} />
              </div>
              <h3 className="text-xl font-black text-dark mb-8 flex items-center gap-3"><CreditCard className="text-secondary" size={24} /> Financial Audit</h3>
              <div className="p-8 bg-muted/50 rounded-3xl text-center mb-8 border border-gray-100/50 shadow-inner group-hover:bg-white transition-all">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Total Transaction Value</p>
                <p className="text-5xl font-black text-dark flex items-center justify-center tracking-tighter">
                    <IndianRupee size={28} className="text-gray-300 mr-1" />{payment?.amount || 0}
                </p>
              </div>
              <div className="space-y-5">
                <DetailRow label="Verified Status" value={
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${payment?.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{payment?.status || 'Pending'}</span>
                } />
                <DetailRow label="Internal Order ID" value={<span className="text-[9px] font-black font-mono bg-muted px-2 py-1 rounded truncate max-w-[120px]">{payment?.razorpayOrderId || 'SYSTEM-GEN'}</span>} />
                <DetailRow label="Gateway Trans ID" value={<span className="text-[9px] font-black font-mono bg-muted px-2 py-1 rounded truncate max-w-[120px]">{payment?.razorpayPaymentId || 'AUDIT-PENDING'}</span>} />
                <DetailRow label="Registry Timestamp" value={payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'NOT RECORDED'} />
              </div>
            </div>

            <div className="bg-dark rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-black/20 group">
              <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Registry Metadata</p>
                  <p className="font-mono text-[10px] text-primary bg-white/5 py-3 px-4 rounded-xl border border-white/5 truncate group-hover:bg-white/10 transition-all cursor-copy" title="Click to copy ID">{student._id}</p>
                  <p className="text-[9px] text-gray-400 mt-5 font-black uppercase tracking-[0.2em]">Initial Enrollment: {new Date(student.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="absolute -bottom-6 -right-6 text-white opacity-[0.03] group-hover:scale-125 transition-all duration-700">
                  <ShieldCheck size={120} />
              </div>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
};

const InfoRow = ({ icon, label, value, color }) => (
  <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl transition-all group/info">
    <div className={`${color} mt-0.5 group-hover/info:scale-110 transition-transform`}>{icon}</div>
    <div className="min-w-0">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-dark tracking-tight truncate">{value}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-black text-dark text-right">{value}</span>
  </div>
);

export default StudentDetails;
