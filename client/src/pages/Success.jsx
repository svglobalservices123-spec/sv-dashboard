import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, Download, Printer } from 'lucide-react';
import { downloadReceipt, getStudentDetails } from '../utils/api';
import { toast } from 'react-hot-toast';

const Success = () => {
  const location = useLocation();
  const [downloading, setDownloading] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = location.state?.studentId;

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const res = await getStudentDetails(studentId);
      setStudent(res.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!studentId) {
      toast.error('Student ID not found. Unable to download receipt.');
      return;
    }

    setDownloading(true);
    const downloadToast = toast.loading('Generating receipt...');

    try {
      const response = await downloadReceipt(studentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${student?.name || 'Student'}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success('Receipt downloaded successfully!', { id: downloadToast });
    } catch (error) {
      console.error(error);
      toast.error('Failed to download receipt.', { id: downloadToast });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eceef4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a56f0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eceef4] font-sans py-12 px-4 md:px-0 flex flex-col items-center">
      {/* Success Notification */}
      <div className="max-w-[780px] w-full mb-8 flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border-l-8 border-green-500">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Enrollment Successful!</h2>
          <p className="text-gray-500 text-sm">Your application and payment have been confirmed.</p>
        </div>
      </div>

      {/* Invoice Design */}
      <div className="bg-[#fafbfd] w-full max-w-[780px] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08),0_32px_64px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-2xl">
        {/* Gradient Strip */}
        <div className="h-[5px] bg-gradient-to-r from-[#0e3bbf] via-[#1a56f0] to-[#c8a84b]"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start p-10 md:p-12 border-b border-[#e8eaf0] gap-8">
          <div>
            <img 
              src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
              alt="SV Global Services" 
              className="h-[52px] object-contain"
            />
          </div>
          <div className="text-left md:text-right">
            <p className="font-serif text-4xl font-bold text-[#0b0f1a] leading-none mb-2 tracking-tight">Invoice</p>
            <div className="text-[13px] text-[#5a6070] space-y-1.5 leading-relaxed">
              <p>Invoice # <span className="text-[#0b0f1a] font-medium">SV-{new Date().getFullYear()}-{studentId?.slice(-3) || '001'}</span></p>
              <p>Date <span className="text-[#0b0f1a] font-medium">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
              <p>Due <span className="text-[#0b0f1a] font-medium">Immediate</span></p>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="flex flex-col md:flex-row justify-between p-10 md:p-12 border-b border-[#e8eaf0] gap-8">
          {/* From */}
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#1a56f0] mb-3">Billed From</p>
            <p className="text-lg font-bold text-[#0b0f1a] mb-1">SV Global Services</p>
            <p className="text-[13px] text-[#5a6070] leading-relaxed">
              Hyderabad, India<br />
              support@svglobalservices.com
            </p>
          </div>
          {/* To */}
          <div className="flex-1 text-left md:text-right">
            <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[#1a56f0] mb-3 md:ml-auto">Billed To</p>
            <p className="text-lg font-bold text-[#0b0f1a] mb-1">{student?.name || 'Student Name'}</p>
            <p className="text-[13px] text-[#5a6070] leading-relaxed">
              {student?.email || 'email@example.com'}<br />
              {student?.phone || 'Phone Number'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="px-10 md:px-12 py-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0b0f1a]">
                  <th className="text-[10px] font-bold tracking-[.1em] uppercase text-[#5a6070] pb-3 text-left">Description</th>
                  <th className="text-[10px] font-bold tracking-[.1em] uppercase text-[#5a6070] pb-3 text-right px-4">Qty</th>
                  <th className="text-[10px] font-bold tracking-[.1em] uppercase text-[#5a6070] pb-3 text-right">Unit Price</th>
                  <th className="text-[10px] font-bold tracking-[.1em] uppercase text-[#5a6070] pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e8eaf0]">
                  <td className="py-6 text-sm text-[#0b0f1a] vertical-middle">
                    <p className="font-bold mb-1">Professional Skill Development — {student?.course || 'Web Technologies'}</p>
                    <p className="text-xs text-[#9aa0b0]">{student?.branch || 'General'} · Self-paced · Certificate included</p>
                  </td>
                  <td className="py-6 text-sm text-[#5a6070] text-right px-4">1</td>
                  <td className="py-6 text-sm text-[#5a6070] text-right">₹499.00</td>
                  <td className="py-6 text-sm text-[#5a6070] text-right">₹499.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end px-10 md:px-12 pb-10">
          <div className="w-full md:w-72">
            <div className="flex justify-between text-[13px] text-[#5a6070] mb-2.5">
              <span>Subtotal</span><span className="text-[#0b0f1a] font-medium">₹499.00</span>
            </div>
            <div className="flex justify-between text-[13px] text-[#5a6070] mb-2.5">
              <span>GST (18%)</span><span className="text-[#0b0f1a] font-medium">₹21.00</span>
            </div>
            <div className="flex justify-between text-[13px] text-[#5a6070] mb-2.5">
              <span>Discount</span><span className="text-[#0b0f1a] font-medium">—</span>
            </div>
            <hr className="border-none border-t border-[#e8eaf0] my-4" />
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-xl text-[#0b0f1a] font-bold">Total Due</span>
              <span className="text-3xl font-bold text-[#1a56f0] tracking-tight">₹520</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mx-10 md:mx-12 mb-10 border border-[#d0dcf8] rounded-md bg-[#eef6ff] p-6 flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[.1em] uppercase text-[#9aa0b0] mb-1.5">Payment Method</p>
            <p className="text-sm font-bold text-[#1040c0]">Razorpay</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[.1em] uppercase text-[#9aa0b0] mb-1.5">Transaction ID</p>
            <p className="text-sm font-bold text-[#1040c0] font-mono">{student?.paymentId || 'TXN-ABC-123'}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[.1em] uppercase text-[#9aa0b0] mb-1.5">Status</p>
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] rounded-full px-3 py-1 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
              Paid
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e8eaf0] p-6 px-10 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif text-sm text-[#5a6070] italic">Thank you for your enrollment!</p>
          <p className="text-[11px] text-[#9aa0b0]">© {new Date().getFullYear()} SV Global Services</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 mb-20 flex flex-col md:flex-row gap-4 w-full max-w-[780px]">
        <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-[#0b0f1a] text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
          <Home size={18} /> Back to Portal
        </Link>
        <button
          onClick={handleDownload}
          disabled={downloading || !studentId}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1a56f0] text-white py-4 rounded-xl font-bold hover:bg-[#0e3bbf] transition-all disabled:opacity-50"
        >
          <Download size={18} className={downloading ? "animate-bounce" : ""} />
          {downloading ? 'Downloading...' : 'Download PDF Receipt'}
        </button>
        <button
          onClick={() => window.print()}
          className="md:w-16 flex items-center justify-center bg-white border border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
          title="Print Page"
        >
          <Printer size={18} />
        </button>
      </div>
    </div>
  );
};

export default Success;
