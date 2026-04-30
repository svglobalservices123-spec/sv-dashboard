import React from 'react';

const FeeReceiptModal = ({ receipt, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptHtml = document.getElementById('printable-receipt').innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${receipt.name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: 'Inter', sans-serif; padding: 15mm; background: white; }
            .receipt-container { width: 100%; max-width: 210mm; margin: 0 auto; position: relative; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="receipt-container">
            ${receiptHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 overflow-y-auto no-print items-start">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header (Non-Printable) */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100 text-blue-900 sticky top-0 z-10 no-print">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-red-600 rounded-full"></div>
             <h2 className="text-xl font-black uppercase tracking-tight">Receipt Preview</h2>
          </div>
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
        <div className="p-4 md:p-12 bg-gray-100 flex items-center justify-center min-h-screen">
          <div 
            id="printable-receipt"
            className="w-full max-w-[210mm] bg-white border border-gray-200 p-[15mm] relative shadow-sm"
            style={{ fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
          >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-12">
              <div className="space-y-4">
                <img 
                  src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" 
                  alt="SVGS Logo" 
                  className="h-16 md:h-20 object-contain"
                />
                <div className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  <p>SV Global Services India Private Limited</p>
                  <p>Hyderabad, Telangana, India</p>
                  <p>support@svglobalservices.com</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black text-blue-900 tracking-tighter mb-2">FEE RECEIPT</h1>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500">Date: <span className="text-blue-900">{new Date(receipt.date).toLocaleDateString('en-GB')}</span></p>
                  <p className="text-[10px] font-bold text-gray-400">RECEIPT NO: <span className="text-gray-600">{receipt._id.toString().toUpperCase()}</span></p>
                </div>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="mb-10 border-t-4 border-blue-900 pt-8">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Student Name</p>
                  <p className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-1">{receipt.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Roll Number</p>
                  <p className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-1">{receipt.rollNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Branch / Stream</p>
                  <p className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-1">{receipt.branch}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Contact Number</p>
                  <p className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-1">{receipt.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">College Institution</p>
                  <p className="text-lg font-bold text-blue-950 border-b border-gray-100 pb-1">{receipt.collegeName}</p>
                </div>
              </div>
            </div>

            {/* Purpose Section */}
            <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Purpose of Payment</p>
               <p className="text-blue-900 font-bold">{receipt.purpose}</p>
            </div>

            {/* Payment Summary Table */}
            <div className="mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="text-right py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Payment Mode</th>
                    <th className="text-right py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-6 font-bold text-blue-950">Registration / Training Fee</td>
                    <td className="py-6 text-right font-bold text-gray-600">{receipt.paymentMode}</td>
                    <td className="py-6 text-right font-black text-blue-900">₹{receipt.amount.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-[#1e3a8a] text-white">
                    <td colSpan="2" className="py-4 px-6 text-right font-black uppercase tracking-widest text-sm">Total Amount Paid</td>
                    <td className="py-4 px-6 text-right font-black text-2xl">₹{receipt.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Section */}
            <div className="grid grid-cols-2 gap-12 mt-20">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest underline decoration-[#dc2626] underline-offset-4">Terms & Conditions</h4>
                <ul className="text-[10px] text-gray-500 space-y-2 leading-relaxed">
                  <li className="flex gap-2"><span>•</span> Fee once paid is non-refundable and non-transferable under any circumstances.</li>
                  <li className="flex gap-2"><span>•</span> This receipt is valid for a period of 6 months from the date of issue.</li>
                  <li className="flex gap-2"><span>•</span> All pending dues must be cleared before the commencement of Viva/Final Exam.</li>
                </ul>
              </div>
              
              <div className="relative flex flex-col items-center justify-end">
                <img 
                  src="https://svglobalservices.com/wp-content/uploads/2026/04/62e9f268-5bde-4ca3-8bba-a841117d6b0d.png" 
                  alt="Stamp" 
                  className="absolute bottom-10 h-32 opacity-70 z-0 pointer-events-none"
                />
                <div className="w-full border-t-2 border-blue-900 pt-3 relative z-10 text-center">
                  <p className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">Authorized Signature</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1 italic">SV Global Services India Pvt Ltd</p>
                </div>
              </div>
            </div>

            {/* Footer Decorative Line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#dc2626]"></div>
          </div>
        </div>
      </div>
            color: white !important;
          }
          .bg-red-600 {
            background-color: #dc2626 !important;
          }
          .bg-gray-50 {
            background-color: #f9fafb !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeReceiptModal;
