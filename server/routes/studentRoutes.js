const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const studentController = require('../controllers/studentController');
const paymentController = require('../controllers/paymentController');
const receiptController = require('../controllers/receiptController');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only JPG, PNG and PDF files are allowed!'));
  }
});

// Structured upload fields
const docUpload = upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'idcard', maxCount: 1 },
]);

const { validateStudentSubmission } = require('../validation/studentValidation');

// Student Routes
router.post('/students', validateStudentSubmission, studentController.createStudent);
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentDetails);
router.put('/students/:id/status', studentController.updateStudentStatus);
router.delete('/students/:id', studentController.deleteStudent);

// Dashboard Stats
router.get('/dashboard/stats', studentController.getDashboardStats);
router.get('/export/students', studentController.exportStudentsExcel);

// Document Routes
router.post('/documents/upload/:studentId', docUpload, studentController.uploadDocuments);
router.get('/documents/:studentId', studentController.getStudentDocuments);

// Payment Routes (Razorpay)
router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/payments/create-order', paymentController.createOrder); // Keep old for compatibility
router.post('/payments/verify', paymentController.verifyPayment); // Keep old for compatibility
router.post('/payments/:studentId', studentController.savePayment);
router.get('/payments/:studentId', studentController.getStudentPayments);
router.get('/payments/receipt/:studentId', receiptController.downloadReceipt);

module.exports = router;
