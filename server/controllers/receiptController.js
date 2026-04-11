const PDFDocument = require('pdfkit');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

exports.downloadReceipt = async (req, res, next) => {
   try {
      const { studentId } = req.params;
      const student = await Student.findById(studentId);
      const payment = await Payment.findOne({ studentId, status: 'Paid' });

      if (!student || !payment) {
         return res.status(404).json({ message: 'Receipt not found or payment not successful' });
      }

      const doc = new PDFDocument({ margin: 50 });
      const filename = `Receipt_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

      res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-type', 'application/pdf');

      doc.pipe(res);

      // Header
      doc.fillColor('#1e3a8a')
         .fontSize(24)
         .text('Svglobal Services', { align: 'center' });
      doc.fontSize(10)
         .text('Professional Internship Training Program', { align: 'center' })
         .moveDown(2);

      // Receipt Title
      doc.fillColor('#000000')
         .fontSize(18)
         .text('PAYMENT RECEIPT', { align: 'center', underline: true })
         .moveDown(2);

      // Receipt Info
      doc.fontSize(12)
         .text(`Receipt No: RCT${payment._id.toString().slice(-8).toUpperCase()}`, { align: 'right' })
         .text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, { align: 'right' })
         .moveDown();

      // Student & Payment Details
      const tableTop = 250;
      doc.font('Helvetica-Bold').text('Bill To:', 50, tableTop);
      doc.font('Helvetica').text(student.name, 50, tableTop + 20);
      doc.text(student.email, 50, tableTop + 35);
      doc.text(student.phone, 50, tableTop + 50);

      doc.font('Helvetica-Bold').text('Course Details:', 350, tableTop);
      doc.font('Helvetica').text(student.course, 350, tableTop + 20);
      doc.text(`Branch: ${student.branch}`, 350, tableTop + 35);
      doc.text(`Roll No: ${student.rollNumber}`, 350, tableTop + 50);

      // Table Header
      const itemTableTop = 350;
      doc.rect(50, itemTableTop, 500, 25).fill('#f3f4f6').stroke('#1e3a8a');
      doc.fillColor('#1e3a8a').font('Helvetica-Bold');
      doc.text('Description', 60, itemTableTop + 7);
      doc.text('Amount', 450, itemTableTop + 7, { width: 90, align: 'right' });

      // Table Content
      doc.fillColor('#000000').font('Helvetica');
      doc.text(`Course Registration Fee - ${student.course}`, 60, itemTableTop + 35);
      doc.text(`₹${payment.amount.toFixed(2)}`, 450, itemTableTop + 35, { width: 90, align: 'right' });

      // Totals
      const totalTop = itemTableTop + 70;
      doc.font('Helvetica-Bold').text('Total Paid:', 350, totalTop);
      doc.text(`₹${payment.amount.toFixed(2)}`, 450, totalTop, { width: 90, align: 'right' });

      doc.moveDown(3);
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Payment ID:', 50)
         .fillColor('#000000')
         .text(payment.razorpayPaymentId, 120);

      doc.fontSize(10)
         .fillColor('#666666')
         .text('Order ID:', 50)
         .fillColor('#000000')
         .text(payment.razorpayOrderId, 120);

      // Verification Seal
      doc.moveDown(4);
      doc.fillColor('#10b981')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('VERIFIED & PAID', { align: 'center' });

      // Footer
      const footerTop = 700;
      doc.fontSize(8)
         .fillColor('#999999')
         .text('This is a computer-generated receipt and does not require a physical signature.', 50, footerTop, { align: 'center' });
      doc.text('Svglobal Services • HYDERABAD • INDIA', 50, footerTop + 15, { align: 'center' });

      doc.end();

   } catch (error) {
      next(error);
   }
};
