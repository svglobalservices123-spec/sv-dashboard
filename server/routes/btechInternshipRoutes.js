const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const btechInternshipController = require('../controllers/btechInternshipController');

// Multer Config for temporary storage before uploading to Drive
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'btech-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

const btechDocsUpload = upload.fields([
  { name: 'collegeIdCard', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'sscMemo', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);

// Routes
router.post('/submit', btechDocsUpload, btechInternshipController.submitApplication);
router.get('/applications', btechInternshipController.getAllApplications);
router.get('/applications/:id', btechInternshipController.getApplicationDetails);
router.delete('/applications/:id', btechInternshipController.deleteApplication);
router.get('/export', btechInternshipController.exportToExcel);

module.exports = router;
