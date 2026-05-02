import React from 'react';

const FeeReceiptModal = ({ receipt, onClose }) => {

  const buildReceiptHTML = () => {
    const dateStr = new Date(receipt.date).toLocaleDateString('en-GB');
    const receiptId = receipt._id.toString().toUpperCase();

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Fee Receipt - ${receipt.name}</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: white;
    color: #1e293b;
    padding: 25px 40px;
    height: 148.5mm; /* Half of A4 page */
    position: relative;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
  .header img { height: 50px; }
  .header-right { text-align: right; }
  .header-right h1 { font-size: 22px; color: #1e3a8a; letter-spacing: -1px; margin-bottom: 4px; }
  .header-right p { font-size: 10px; color: #6b7280; font-weight: 600; }
  .header-right .date-val { color: #1e3a8a; }
  .company-info { font-size: 8px; color: #9ca3af; margin-top: 6px; line-height: 1.5; }
  .blue-bar { height: 3px; background: #1e3a8a; margin-bottom: 15px; }
  .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 30px; margin-bottom: 15px; }
  .field-item { }
  .field-item.full { grid-column: span 2; }
  .field-label { font-size: 8px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
  .field-value { font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
  .purpose-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 6px; padding: 12px 16px; margin-bottom: 15px; }
  .purpose-box .field-label { margin-bottom: 4px; }
  .purpose-box .field-value { border-bottom: none; padding-bottom: 0; color: #1e3a8a; }
  .pay-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  .pay-table thead th { text-align: left; padding: 8px 0; font-size: 9px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; }
  .pay-table thead th:nth-child(2), .pay-table thead th:nth-child(3) { text-align: right; }
  .pay-table tbody td { padding: 10px 0; font-weight: 700; font-size: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
  .pay-table tbody td:nth-child(2) { text-align: right; color: #6b7280; }
  .pay-table tbody td:nth-child(3) { text-align: right; color: #1e3a8a; font-weight: 900; }
  .total-row td { background: #1e3a8a !important; color: white !important; padding: 10px 12px !important; font-weight: 900 !important; }
  .total-row td:first-child { text-align: right; text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px !important; }
  .total-row td:last-child { text-align: right; font-size: 16px !important; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25px; }
  .terms h4 { font-size: 9px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 2px solid #dc2626; display: inline-block; }
  .terms ul { list-style: none; font-size: 8px; color: #6b7280; line-height: 1.6; }
  .terms ul li::before { content: "• "; }
  .sig-section { text-align: center; min-width: 160px; position: relative; }
  .sig-section .stamp { height: 75px; opacity: 0.7; margin-bottom: -20px; }
  .sig-line { border-top: 2px solid #1e3a8a; padding-top: 6px; }
  .sig-line p { font-size: 9px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1.5px; }
  .sig-line .sub { font-size: 7px; color: #9ca3af; font-style: italic; margin-top: 2px; font-weight: 600; }
  .bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: #dc2626; }
</style>
</head>
<body>

<div class="header">
  <div>
    <img src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" alt="SVGS Logo">
    <div class="company-info">
      <p>SV Global Services India Private Limited</p>
      <p>Hyderabad, Telangana, India</p>
    </div>
  </div>
  <div class="header-right">
    <h1>FEE RECEIPT</h1>
    <p>Date: <span class="date-val">${dateStr}</span></p>
    <p>Receipt No: ${receiptId}</p>
  </div>
</div>

<div class="blue-bar"></div>

<div class="fields-grid">
  <div class="field-item">
    <div class="field-label">Student Name</div>
    <div class="field-value">${receipt.name}</div>
  </div>
  <div class="field-item">
    <div class="field-label">Roll Number</div>
    <div class="field-value">${receipt.rollNumber}</div>
  </div>
  <div class="field-item">
    <div class="field-label">Branch / Stream</div>
    <div class="field-value">${receipt.branch}</div>
  </div>
  <div class="field-item">
    <div class="field-label">Contact Number</div>
    <div class="field-value">${receipt.phone}</div>
  </div>
  <div class="field-item full">
    <div class="field-label">College / Institution</div>
    <div class="field-value">${receipt.collegeName}</div>
  </div>
</div>

<div class="purpose-box">
  <div class="field-label">Purpose of Payment</div>
  <div class="field-value">${receipt.purpose}</div>
</div>

<table class="pay-table">
  <thead>
    <tr>
      <th>Description</th>
      <th>Payment Mode</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Registration / Training Fee</td>
      <td>${receipt.paymentMode}</td>
      <td>₹${(receipt.totalFee !== undefined ? receipt.totalFee : receipt.amount).toLocaleString()}</td>
    </tr>
    <tr>
      <td colspan="2" style="text-align: right; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Fee Paid</td>
      <td style="color: #16a34a;">₹${(receipt.paidFee !== undefined ? receipt.paidFee : receipt.amount).toLocaleString()}</td>
    </tr>
    <tr>
      <td colspan="2" style="text-align: right; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Balance Due</td>
      <td style="color: #dc2626;">₹${(receipt.due !== undefined ? receipt.due : 0).toLocaleString()}</td>
    </tr>
    <tr class="total-row">
      <td colspan="2">Total Amount Paid</td>
      <td>₹${(receipt.paidFee !== undefined ? receipt.paidFee : receipt.amount).toLocaleString()}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <div class="terms">
    <h4>Terms & Conditions</h4>
    <ul>
      <li>Fee once paid is non-refundable and non-transferable.</li>
      <li>This receipt is valid for 6 months from the date of issue.</li>
      <li>All dues must be cleared before Viva / Final Exam.</li>
    </ul>
  </div>
  <div class="sig-section">
    <img class="stamp" src="https://svglobalservices.com/wp-content/uploads/2026/04/62e9f268-5bde-4ca3-8bba-a841117d6b0d.png" alt="Stamp">
    <div class="sig-line">
      <p>Authorized Signature</p>
      <p class="sub">SV Global Services India Pvt Ltd</p>
    </div>
  </div>
</div>

<div class="bottom-bar"></div>

</body>
</html>`;
  };

  const handlePrint = () => {
    // Create a hidden iframe
    let iframe = document.getElementById('receipt-print-frame');
    if (iframe) iframe.remove();

    iframe = document.createElement('iframe');
    iframe.id = 'receipt-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '210mm';
    iframe.style.height = '148.5mm';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(buildReceiptHTML());
    doc.close();

    // Wait for images to load then print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 500);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 overflow-y-auto items-start">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100 text-blue-900 sticky top-0 z-10">
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

        {/* Receipt Preview (on-screen version using Tailwind) */}
        <div className="p-4 md:p-12 bg-gray-100 flex items-center justify-center">
          <div
            className="w-full max-w-[210mm] bg-white border border-gray-200 p-8 md:p-12 relative shadow-sm"
            style={{ fontFamily: "'Inter', Arial, sans-serif" }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-5 border-b border-gray-200">
              <div>
                <img
                  src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png"
                  alt="SVGS Logo"
                  className="h-16 md:h-20 object-contain"
                />
                <div className="text-[9px] text-gray-400 mt-3 leading-relaxed font-medium">
                  <p>SV Global Services India Private Limited</p>
                  <p>Hyderabad, Telangana, India</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tighter mb-2">FEE RECEIPT</h1>
                <p className="text-xs font-bold text-gray-500">Date: <span className="text-blue-900">{new Date(receipt.date).toLocaleDateString('en-GB')}</span></p>
                <p className="text-[10px] font-bold text-gray-400 mt-1">Receipt No: {receipt._id.toString().toUpperCase()}</p>
              </div>
            </div>

            {/* Blue accent bar */}
            <div className="h-1 bg-blue-900 mb-6"></div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 mb-6">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Student Name</p>
                <p className="text-base font-bold text-slate-900 border-b border-gray-100 pb-1">{receipt.name}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Roll Number</p>
                <p className="text-base font-bold text-slate-900 border-b border-gray-100 pb-1">{receipt.rollNumber}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Branch / Stream</p>
                <p className="text-base font-bold text-slate-900 border-b border-gray-100 pb-1">{receipt.branch}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Contact Number</p>
                <p className="text-base font-bold text-slate-900 border-b border-gray-100 pb-1">{receipt.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">College / Institution</p>
                <p className="text-base font-bold text-slate-900 border-b border-gray-100 pb-1">{receipt.collegeName}</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Purpose of Payment</p>
              <p className="text-blue-900 font-bold">{receipt.purpose}</p>
            </div>

            {/* Payment Table */}
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="text-right py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Mode</th>
                  <th className="text-right py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-5 font-bold text-slate-900 text-sm">Registration / Training Fee</td>
                  <td className="py-5 text-right font-bold text-gray-500 text-sm">{receipt.paymentMode}</td>
                  <td className="py-5 text-right font-black text-blue-900 text-sm">₹{(receipt.totalFee !== undefined ? receipt.totalFee : receipt.amount).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td colSpan="2" className="py-3 px-4 text-right font-bold text-gray-400 text-xs uppercase tracking-widest">Fee Paid</td>
                  <td className="py-3 px-4 text-right font-black text-green-600 text-sm">₹{(receipt.paidFee !== undefined ? receipt.paidFee : receipt.amount).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td colSpan="2" className="py-3 px-4 text-right font-bold text-gray-400 text-xs uppercase tracking-widest">Balance Due</td>
                  <td className="py-3 px-4 text-right font-black text-red-600 text-sm">₹{(receipt.due !== undefined ? receipt.due : 0).toLocaleString()}</td>
                </tr>
                <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
                  <td colSpan="2" className="py-3 px-4 text-right font-black uppercase tracking-widest text-xs">Total Amount Paid</td>
                  <td className="py-3 px-4 text-right font-black text-xl">₹{(receipt.paidFee !== undefined ? receipt.paidFee : receipt.amount).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Footer - Terms + Signature */}
            <div className="flex justify-between items-end mt-12 gap-8">
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2 pb-1 inline-block" style={{ borderBottom: '2px solid #dc2626' }}>Terms & Conditions</h4>
                <ul className="text-[9px] text-gray-500 space-y-1 leading-relaxed">
                  <li>• Fee once paid is non-refundable and non-transferable.</li>
                  <li>• This receipt is valid for 6 months from the date of issue.</li>
                  <li>• All dues must be cleared before Viva / Final Exam.</li>
                </ul>
              </div>
              <div className="text-center min-w-[180px] relative">
                <img
                  src="https://svglobalservices.com/wp-content/uploads/2026/04/62e9f268-5bde-4ca3-8bba-a841117d6b0d.png"
                  alt="Stamp"
                  className="h-24 opacity-70 mx-auto mb-[-20px]"
                />
                <div className="border-t-2 border-blue-900 pt-2 relative z-10">
                  <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">Authorized Signature</p>
                  <p className="text-[8px] font-bold text-gray-400 mt-1 italic">SV Global Services India Pvt Ltd</p>
                </div>
              </div>
            </div>

            {/* Bottom red accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: '#dc2626' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptModal;
