import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Home, Download } from 'lucide-react';
import { downloadReceipt } from '../utils/api';
import { toast } from 'react-hot-toast';

const Success = () => {
  const location = useLocation();
  const [downloading, setDownloading] = useState(false);
  const studentId = location.state?.studentId;

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
      link.setAttribute('download', `Receipt_${Date.now()}.pdf`);
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

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"></div>

        <div className="mb-8 flex justify-center">
          <div className="bg-green-100 p-6 rounded-full shadow-inner animate-bounce">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-display font-black text-dark mb-4 tracking-tighter">Application Received!</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          Thank you for choosing Svglobal Services. Your enrollment application has been securely logged on our system for verification.
        </p>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-left">

            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-secondary font-bold italic tracking-wide">
            Expect a notification within 24-48 business hours.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          <Link to="/" className="btn-primary group flex items-center justify-center gap-2 py-4">
            <Home size={18} /> Back to Portal
          </Link>
          <button
            onClick={handleDownload}
            disabled={downloading || !studentId}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-dark text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <Download size={16} className={downloading ? "animate-bounce" : ""} />
            {downloading ? 'Downloading...' : 'Download Payment Receipt'}
          </button>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Svglobal Services</p>
    </div>
  );
};

export default Success;
