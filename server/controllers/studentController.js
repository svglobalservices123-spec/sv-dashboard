const Student = require('../models/Student');
const Document = require('../models/Document');
const Payment = require('../models/Payment');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// Create Student
exports.createStudent = async (req, res, next) => {
  try {
    const { name, phone, email, branch, rollNumber, collegeName, location, course, courseType, year } = req.body;
    
    // Generate Application ID: [Date][203][Year][Serial]
    // We use a robust approach to find a unique ID and avoid race conditions
    let applicationId;
    let isUnique = false;
    
    // Get the highest existing serial to start from
    const lastStudent = await Student.findOne().sort({ createdAt: -1 });
    let currentSerialNum = 0;
    if (lastStudent && lastStudent.applicationId) {
      // The applicationId format is [day(2)]203[year(4)][serial(3+)]
      // We extract the part after the first 9 characters
      const serialPart = lastStudent.applicationId.substring(9);
      currentSerialNum = parseInt(serialPart) || 0;
    } else {
      // Fallback to count if no last student or format mismatch
      currentSerialNum = await Student.countDocuments();
    }

    let nextSerialNum = currentSerialNum + 1;

    while (!isUnique) {
      const serial = nextSerialNum.toString().padStart(3, '0');
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const yearStr = now.getFullYear().toString();
      applicationId = `${day}203${yearStr}${serial}`;
      
      const existing = await Student.findOne({ applicationId });
      if (!existing) {
        isUnique = true;
      } else {
        nextSerialNum++;
      }
    }

    const student = await Student.create({ 
      name, phone, email, branch, rollNumber, collegeName, location, course, courseType, year,
      applicationId 
    });
    res.status(201).json({ success: true, studentId: student._id });
  } catch (error) {
    next(error);
  }
};

// Get All Students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    // Attach payment status to each student
    const studentsWithPayment = await Promise.all(
      students.map(async (s) => {
        const payment = await Payment.findOne({ studentId: s._id });
        return { ...s.toObject(), paymentStatus: payment ? payment.status : 'Pending' };
      })
    );
    res.json(studentsWithPayment);
  } catch (error) {
    next(error);
  }
};

// Get Single Student (Profile + Documents + Payment)
exports.getStudentDetails = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) { res.status(404); throw new Error('Student not found'); }
    const documents = await Document.find({ studentId: student._id });
    const payment = await Payment.findOne({ studentId: student._id });
    res.json({ student, documents, payment });
  } catch (error) {
    next(error);
  }
};

// Upload Documents (structured: aadhaar, marksheet, idcard)
exports.uploadDocuments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      res.status(400); throw new Error('At least one document is required.');
    }
    const docTypes = ['aadhaar', 'marksheet', 'idcard'];
    const promises = [];
    docTypes.forEach(type => {
      if (files[type]) {
        files[type].forEach(file => {
          promises.push(
            Document.create({
              studentId,
              documentType: type,
              fileName: file.originalname,
              filePath: file.path.replace(/\\/g, '/'),
              fileType: file.mimetype
            })
          );
        });
      }
    });
    await Promise.all(promises);
    res.json({ success: true, message: 'Documents uploaded.' });
  } catch (error) {
    next(error);
  }
};

// Save Payment
exports.savePayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { amount, razorpayOrderId, razorpayPaymentId, razorpaySignature, status } = req.body;
    const payment = await Payment.create({
      studentId, amount,
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      razorpaySignature: razorpaySignature || '',
      status: status || 'Paid'
    });
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// Get Documents
exports.getStudentDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ studentId: req.params.studentId });
    res.json(documents);
  } catch (error) { next(error); }
};

// Get Payments
exports.getStudentPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId });
    res.json(payments);
  } catch (error) { next(error); }
};

// Update Status
exports.updateStudentStatus = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, student });
  } catch (error) { next(error); }
};

// Delete Student
exports.deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const documents = await Document.find({ studentId });
    documents.forEach(doc => {
      const fullPath = path.join(__dirname, '..', doc.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });
    await Document.deleteMany({ studentId });
    await Payment.deleteMany({ studentId });
    await Student.findByIdAndDelete(studentId);
    res.json({ success: true, message: 'Record deleted.' });
  } catch (error) { next(error); }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'Paid' });
    const pendingPayments = await Payment.countDocuments({ status: 'Pending' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({
      totalStudents,
      totalPayments,
      pendingPayments,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) { next(error); }
};

// Export Students to Excel
exports.exportStudentsExcel = async (req, res, next) => {
  try {
    const { status } = req.query; // all, Paid, Pending
    const students = await Student.find().sort({ createdAt: -1 });

    // Fetch payment info for all students
    let filteredData = await Promise.all(
      students.map(async (s) => {
        const payment = await Payment.findOne({ studentId: s._id });
        const sObj = s.toObject();
        return {
          Name: sObj.name,
          Email: sObj.email,
          Phone: sObj.phone,
          'Roll Number': sObj.rollNumber,
          'Specialized Course': sObj.course,
          'Course Type': sObj.courseType,
          Year: sObj.year,
          Branch: sObj.branch,
          College: sObj.collegeName,
          Location: sObj.location,
          'Registration Date': new Date(sObj.createdAt).toLocaleDateString(),
          'Payment Status': payment ? payment.status : 'Pending',
          'Payment Amount': payment ? `₹${payment.amount}` : '—',
          'Razorpay Order ID': payment?.razorpayOrderId || '—',
          'Razorpay Payment ID': payment?.razorpayPaymentId || '—'
        };
      })
    );

    // Apply Filter
    if (status && status !== 'all') {
      filteredData = filteredData.filter(item => item['Payment Status'] === status);
    }

    // Create Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Styling (optional but good for premium feel)
    const colWidths = [
      { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 25 }
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    const fileName = `Students_${status || 'All'}_${Date.now()}.xlsx`;
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    next(error);
  }
};
