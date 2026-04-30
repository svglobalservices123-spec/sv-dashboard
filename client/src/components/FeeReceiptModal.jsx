import React, { useRef } from 'react';

const FeeReceiptModal = ({ receipt, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 overflow-y-auto no-print items-start">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100 text-blue-900 sticky top-0 z-10">
          <h2 className="text-xl font-black uppercase tracking-tight">Receipt Preview</h2>
          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-900/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Receipt
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Receipt Content (A4 Style) */}
        <div className="p-8 md:p-12 bg-white text-slate-900 min-h-[600px] flex items-center justify-center">
          <div 
            id="printable-receipt"
            className="w-full max-w-[800px] border-2 border-slate-300 p-8 md:p-12 relative"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-slate-100 pb-6">
              <img 
                src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
                alt="Logo" 
                className="h-16 md:h-20"
              />
              <div className="text-right">
                <h1 className="text-2xl font-black text-blue-900 tracking-tighter">FEE RECEIPT</h1>
                <p className="text-slate-500 font-bold mt-1">Date: {new Date(receipt.date).toLocaleDateString()}</p>
                <p className="text-slate-400 text-xs mt-1">ID: {receipt._id.toString().toUpperCase()}</p>
              </div>
            </div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roll Number</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.rollNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.branch}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">College Name</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.collegeName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose of Payment</p>
                <p className="text-lg font-bold border-b border-slate-200 pb-1">{receipt.purpose}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-500 font-medium">Payment Mode</p>
                <p className="font-bold text-slate-900">{receipt.paymentMode}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <p className="text-xl font-black text-slate-900">Total Amount</p>
                <p className="text-3xl font-black text-blue-900">₹{receipt.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h4>
                <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4 italic">
                  <li>Fee once paid is non-refundable</li>
                  <li>Receipt valid for 6 months</li>
                  <li>All dues must be cleared before Viva</li>
                </ul>
              </div>
              
              <div className="relative text-center min-w-[200px]">
                <img 
                  src="https://svglobalservices.com/wp-content/uploads/2026/04/62e9f268-5bde-4ca3-8bba-a841117d6b0d.png" 
                  alt="Stamp" 
                  className="absolute -top-16 left-1/2 -translate-x-1/2 h-24 opacity-80"
                />
                <div className="border-t-2 border-slate-900 pt-2 mt-12">
                  <p className="text-xs font-black uppercase tracking-widest">Authorized Signature</p>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-900"></div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          /* Reset Page */
          @page {
            size: A4;
            margin: 0;
          }
          
          /* Hide EVERYTHING in the document */
          html, body, #root, #root * {
            visibility: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }

          /* Show ONLY the printable receipt and its children */
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }

          /* Position the receipt at the absolute top-left of the physical page */
          #printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important; /* A4 Width */
            height: 297mm !important; /* A4 Height */
            background-color: white !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            z-index: 99999 !important;
            border: none !important;
            display: block !important;
          }

          /* Hide UI elements specifically */
          .no-print, button, .bg-black/80 {
            display: none !important;
          }
          
          /* Force background colors and images for stamp/logo */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeReceiptModal;
