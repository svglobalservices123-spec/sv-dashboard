import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudentDetails, updateStudentStatus, deleteStudent } from '../utils/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Download, FileText, IndianRupee, CreditCard, User, Phone, Mail, GraduationCap, MapPin, Building, CheckCircle2, XCircle, Trash2, Loader2, ShieldCheck } from 'lucide-react';

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
    <div className="flex bg-muted min-h-screen"><Sidebar /><div className="flex-1 flex items-center justify-center ml-64"><Loader2 className="animate-spin text-primary" size={40} /></div></div>
  );

  if (!data) return (
    <div className="flex bg-muted min-h-screen"><Sidebar /><div className="flex-1 flex flex-col items-center justify-center ml-64 gap-4"><p className="text-gray-400 font-bold">Student not found.</p><Link to="/admin" className="text-primary hover:underline text-sm">Back to Dashboard</Link></div></div>
  );

  const { student, documents, payment } = data;
  const docLabels = { aadhaar: 'Aadhaar Card', marksheet: '10th Marksheet', idcard: 'ID Card', other: 'Document' };

  return (
    <div className="flex bg-muted min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-gray-100">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest"><ArrowLeft size={16} /> Back</Link>
          <div className="flex gap-3">
            {student.status === 'Pending' && (<>
              <button disabled={updating} onClick={() => handleStatusUpdate('Approved')} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"><CheckCircle2 size={14} /> Approve</button>
              <button disabled={updating} onClick={() => handleStatusUpdate('Rejected')} className="bg-secondary hover:bg-red-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"><XCircle size={14} /> Reject</button>
            </>)}
            <button onClick={handleDelete} className="p-2 bg-gray-50 text-gray-400 hover:text-secondary rounded-xl border border-gray-100 transition-all"><Trash2 size={18} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-dark p-10 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center font-display text-4xl font-black mx-auto mb-4">{student.name.charAt(0)}</div>
                <h2 className="text-2xl font-black">{student.name}</h2>
                <span className={`inline-block mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.status === 'Approved' ? 'bg-green-500' : student.status === 'Rejected' ? 'bg-secondary' : 'bg-primary'}`}>{student.status}</span>
              </div>
              <div className="p-8 grid grid-cols-2 gap-6">
                <InfoRow icon={<Phone size={16} />} label="Phone" value={student.phone} />
                <InfoRow icon={<Mail size={16} />} label="Email" value={student.email} />
                <InfoRow icon={<GraduationCap size={16} />} label="Course" value={student.course} />
                <InfoRow icon={<GraduationCap size={16} />} label="Branch" value={student.branch || '—'} />
                <InfoRow icon={<ShieldCheck size={16} />} label="Roll Number" value={student.rollNumber || '—'} />
                <InfoRow icon={<Building size={16} />} label="College" value={student.collegeName || '—'} />
                <InfoRow icon={<MapPin size={16} />} label="Location" value={student.location || '—'} />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-black text-dark mb-6 flex items-center gap-2"><FileText className="text-primary" size={20} /> Uploaded Documents</h3>
              {documents.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, i) => (
                    <div key={i} className="bg-muted rounded-xl p-5 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-primary group-hover:bg-primary group-hover:text-white transition-all"><FileText size={18} /></div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-dark truncate">{doc.fileName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{docLabels[doc.documentType] || doc.documentType}</p>
                        </div>
                      </div>
                      <a href={`${import.meta.env.VITE_API_URL}/${doc.filePath}`} target="_blank" rel="noreferrer" className="w-9 h-9 bg-white text-gray-400 rounded-lg hover:text-white hover:bg-primary transition-all flex items-center justify-center border border-gray-100"><Download size={16} /></a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-black text-dark mb-6 flex items-center gap-2"><CreditCard className="text-secondary" size={20} /> Payment Details</h3>
              <div className="p-8 bg-muted rounded-xl text-center mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount</p>
                <p className="text-4xl font-black text-dark flex items-center justify-center"><IndianRupee size={24} className="text-gray-300 mr-1" />{payment?.amount || 0}</p>
              </div>
              <div className="space-y-4">
                <DetailRow label="Status" value={
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${payment?.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{payment?.status || 'Pending'}</span>
                } />
                <DetailRow label="Order ID" value={<span className="text-[10px] font-mono">{payment?.razorpayOrderId || '—'}</span>} />
                <DetailRow label="Payment ID" value={<span className="text-[10px] font-mono">{payment?.razorpayPaymentId || '—'}</span>} />
                <DetailRow label="Date" value={payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} />
              </div>
            </div>

            <div className="bg-dark rounded-2xl p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Reference</p>
              <p className="font-mono text-xs text-primary bg-white/5 px-3 py-2 rounded-lg">{student._id}</p>
              <p className="text-[8px] text-gray-500 mt-3 uppercase tracking-widest">Enrolled {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
    <div className="text-primary mt-0.5">{icon}</div>
    <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p><p className="text-sm font-bold text-dark">{value}</p></div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-50">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-bold text-dark">{value}</span>
  </div>
);

export default StudentDetails;
