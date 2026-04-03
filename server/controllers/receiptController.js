const puppeteer = require('puppeteer');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

function buildInvoiceHTML(student, payment) {
  const receiptNo = 'SV-' + new Date(payment.createdAt).getFullYear() + '-' + payment._id.toString().slice(-6).toUpperCase();
  const dateString = new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const amount = payment.amount || 0;
  const subtotal = (amount / 1.18).toFixed(2);
  const gstAmount = (amount - parseFloat(subtotal)).toFixed(2);
  const currentYear = new Date().getFullYear();
  const txnId = payment.razorpayPaymentId || 'N/A';

  return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'<meta charset="UTF-8"/>' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
'<title>Invoice ' + receiptNo + '</title>' +
'<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>' +
'</head>' +
'<body style="margin:0;padding:48px 16px;background:#eceef4;font-family:\'DM Sans\',sans-serif;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;box-sizing:border-box;">' +

'<div style="background:#fafbfd;width:100%;max-width:780px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.08),0 32px 64px rgba(0,0,0,.06);overflow:hidden;">' +

  // Gradient Strip
  '<div style="height:5px;background:linear-gradient(90deg,#0e3bbf 0%,#1a56f0 50%,#c8a84b 100%);"></div>' +

  // Header
  '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:40px 48px 32px;border-bottom:1px solid #e8eaf0;">' +
    '<div>' +
      '<img src="https://svglobalservices.com/wp-content/uploads/2025/12/SVGS-logo-png.png" alt="SV Global Services" style="height:52px;object-fit:contain;"/>' +
    '</div>' +
    '<div style="text-align:right;">' +
      '<p style="font-family:\'Playfair Display\',serif;font-size:36px;letter-spacing:-.5px;color:#0b0f1a;line-height:1;margin:0;">Invoice</p>' +
      '<p style="font-size:13px;color:#5a6070;margin-top:10px;line-height:1.9;">' +
        'Invoice&nbsp;#&nbsp;<span style="color:#0b0f1a;font-weight:500;">' + receiptNo + '</span><br/>' +
        'Date&nbsp;<span style="color:#0b0f1a;font-weight:500;">' + dateString + '</span><br/>' +
        'Due&nbsp;<span style="color:#0b0f1a;font-weight:500;">Immediate</span>' +
      '</p>' +
    '</div>' +
  '</div>' +

  // Parties
  '<div style="display:flex;justify-content:space-between;padding:32px 48px;border-bottom:1px solid #e8eaf0;gap:24px;">' +
    '<div style="flex:1;">' +
      '<p style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#1a56f0;margin:0 0 12px;">Billed From</p>' +
      '<p style="font-size:16px;font-weight:600;color:#0b0f1a;margin:0 0 4px;">SV Global Services</p>' +
      '<p style="font-size:13px;color:#5a6070;margin:0;line-height:1.8;">Hyderabad, India<br/>support@svglobalservices.com</p>' +
    '</div>' +
    '<div style="flex:1;text-align:right;">' +
      '<p style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#1a56f0;margin:0 0 12px;">Billed To</p>' +
      '<p style="font-size:16px;font-weight:600;color:#0b0f1a;margin:0 0 4px;">' + student.name + '</p>' +
      '<p style="font-size:13px;color:#5a6070;margin:0;line-height:1.8;">' + student.email + '<br/>' + student.phone + '</p>' +
    '</div>' +
  '</div>' +

  // Table
  '<div style="padding:0 48px;">' +
    '<table style="width:100%;border-collapse:collapse;margin:32px 0 0;">' +
      '<thead>' +
        '<tr style="border-bottom:2px solid #0b0f1a;">' +
          '<th style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5a6070;padding:0 0 12px;text-align:left;">Description</th>' +
          '<th style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5a6070;padding:0 0 12px;text-align:right;">Qty</th>' +
          '<th style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5a6070;padding:0 0 12px;text-align:right;">Unit Price</th>' +
          '<th style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5a6070;padding:0 0 12px;text-align:right;">Total</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr style="border-bottom:1px solid #e8eaf0;">' +
          '<td style="padding:16px 0;font-size:14px;color:#0b0f1a;vertical-align:middle;">' +
            '<p style="font-weight:500;margin:0;">Course Enrollment — ' + student.course + '</p>' +
            '<p style="font-size:12px;color:#9aa0b0;margin:3px 0 0;">Full access · Self-paced · Certificate included</p>' +
          '</td>' +
          '<td style="padding:16px 0;font-size:14px;color:#5a6070;text-align:right;vertical-align:middle;">1</td>' +
          '<td style="padding:16px 0;font-size:14px;color:#5a6070;text-align:right;vertical-align:middle;">\u20B9' + subtotal + '</td>' +
          '<td style="padding:16px 0;font-size:14px;color:#5a6070;text-align:right;vertical-align:middle;">\u20B9' + subtotal + '</td>' +
        '</tr>' +
      '</tbody>' +
    '</table>' +
  '</div>' +

  // Totals
  '<div style="display:flex;justify-content:flex-end;padding:24px 48px 36px;">' +
    '<div style="width:280px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;color:#5a6070;margin-bottom:10px;">' +
        '<span>Subtotal</span><span style="color:#0b0f1a;font-weight:500;">\u20B9' + subtotal + '</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;color:#5a6070;margin-bottom:10px;">' +
        '<span>GST (18%)</span><span style="color:#0b0f1a;font-weight:500;">\u20B9' + gstAmount + '</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;color:#5a6070;margin-bottom:10px;">' +
        '<span>Discount</span><span style="color:#0b0f1a;font-weight:500;">—</span>' +
      '</div>' +
      '<hr style="border:none;border-top:1px solid #e8eaf0;margin:14px 0;"/>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;">' +
        '<span style="font-family:\'Playfair Display\',serif;font-size:18px;color:#0b0f1a;">Total Due</span>' +
        '<span style="font-size:28px;font-weight:600;color:#1a56f0;letter-spacing:-.5px;">\u20B9' + amount + '</span>' +
      '</div>' +
    '</div>' +
  '</div>' +

  // Payment Info
  '<div style="margin:0 48px 40px;border:1px solid #d0dcf8;border-radius:6px;background:#eef6ff;padding:20px 24px;display:flex;gap:0;align-items:center;">' +
    '<div style="flex:1;">' +
      '<p style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9aa0b0;margin:0 0 5px;">Payment Method</p>' +
      '<p style="font-size:13px;font-weight:500;color:#1040c0;margin:0;">Razorpay</p>' +
    '</div>' +
    '<div style="flex:1;">' +
      '<p style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9aa0b0;margin:0 0 5px;">Transaction ID</p>' +
      '<p style="font-size:13px;font-weight:500;color:#1040c0;margin:0;">' + txnId + '</p>' +
    '</div>' +
    '<div style="flex:1;">' +
      '<p style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9aa0b0;margin:0 0 5px;">Status</p>' +
      '<span style="display:inline-flex;align-items:center;gap:7px;background:#dcfce7;color:#166534;border:1px solid #bbf7d0;border-radius:20px;font-size:12px;font-weight:600;padding:4px 12px;">' +
        '<span style="width:7px;height:7px;border-radius:50%;background:#22c55e;display:inline-block;"></span>' +
        'Paid' +
      '</span>' +
    '</div>' +
  '</div>' +

  // Footer
  '<div style="border-top:1px solid #e8eaf0;padding:24px 48px;display:flex;justify-content:space-between;align-items:center;">' +
    '<p style="font-family:\'Playfair Display\',serif;font-size:16px;color:#5a6070;font-style:italic;margin:0;">Thank you for your enrollment!</p>' +
    '<p style="font-size:12px;color:#9aa0b0;margin:0;">&copy; ' + currentYear + ' SV Global Services</p>' +
  '</div>' +

'</div>' +
'</body>' +
'</html>';
}

exports.downloadReceipt = async (req, res, next) => {
   try {
      const { studentId } = req.params;
      const student = await Student.findById(studentId);
      const payment = await Payment.findOne({ studentId, status: 'Paid' });

      if (!student || !payment) {
         return res.status(404).json({ message: 'Receipt not found or payment not successful' });
      }

      const htmlContent = buildInvoiceHTML(student, payment);

      let browser;
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();

        await page.emulateMediaType('screen');
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        });

        await browser.close();

        const filename = 'Receipt_' + student.name.replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
        res.end(pdfBuffer);
      } catch (pdfError) {
        if (browser) await browser.close();
        console.error('Puppeteer PDF generation error:', pdfError);
        res.status(500).json({ message: 'Failed to generate PDF document' });
      }

   } catch (error) {
      console.error('Download Receipt error:', error);
      next(error);
   }
};
