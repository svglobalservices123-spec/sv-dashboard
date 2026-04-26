const BtechInternship = require('../models/BtechInternship');
const { uploadFileToDrive } = require('../utils/googleDrive');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Btech uses its own Google Drive folder — separate from Diploma
const BTECH_FOLDER_ID = process.env.GOOGLE_DRIVE_BTECH_FOLDER_ID;

exports.submitApplication = async (req, res, next) => {
  try {
    if (!BTECH_FOLDER_ID) {
      throw new Error('GOOGLE_DRIVE_BTECH_FOLDER_ID not configured on server.');
    }

    const {
      studentEmail, studentFullName, studentPhone, parentPhone, gender, dob,
      fatherName, motherName, age, caste, aadharNumber, sscHallTicket,
      state,
      collegeName, branch, rollNumber, degreePercentage,
      trainingMode, companyName, course
    } = req.body;

    const files = req.files || {};
    // Files are optional for manual admin entry, but required for public form.
    // We'll let the frontend handle the requirement logic for the public form.

    // Upload files to Google Drive (Btech folder)
    const uploadTasks = [];
    const docKeys = ['collegeIdCard', 'aadharCard', 'sscMemo', 'photo'];
    
    const uploadedDocs = {};

    for (const key of docKeys) {
      if (files[key] && files[key][0]) {
        const file = files[key][0];
        const fileName = `BTECH_${studentFullName}_${key}_${Date.now()}${path.extname(file.originalname)}`;
        
        uploadTasks.push(
          uploadFileToDrive(file.path, fileName, BTECH_FOLDER_ID).then(result => {
            uploadedDocs[key] = {
              id: result.id,
              url: result.url
            };
            // Delete local file after upload
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          })
        );
      }
    }

    await Promise.all(uploadTasks);

    const application = await BtechInternship.create({
      studentEmail, studentFullName, studentPhone, parentPhone, gender, dob,
      fatherName, motherName, age, caste, aadharNumber, sscHallTicket,
      state,
      collegeName, branch, rollNumber, degreePercentage,
      trainingMode, companyName, course,
      ...uploadedDocs
    });

    res.status(201).json({ success: true, message: 'Btech Internship application submitted successfully', applicationId: application._id });
  } catch (error) {
    // Cleanup local files on error
    if (req.files) {
      Object.values(req.files).forEach(fileArr => {
        fileArr.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      });
    }
    next(error);
  }
};

exports.getAllApplications = async (req, res, next) => {
  try {
    const { course, state } = req.query;
    let query = {};
    
    if (course && course !== 'all') {
      query.course = course;
    }
    if (state && state !== 'all') {
      query.state = state;
    }

    const applications = await BtechInternship.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.getApplicationDetails = async (req, res, next) => {
  try {
    const application = await BtechInternship.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }
    res.json(application);
  } catch (error) {
    next(error);
  }
};

exports.exportToExcel = async (req, res, next) => {
  try {
    const { course, state } = req.query;
    let query = {};
    if (course && course !== 'all') query.course = course;
    if (state && state !== 'all') query.state = state;

    const applications = await BtechInternship.find(query).sort({ createdAt: -1 });

    const data = applications.map(app => ({
      'Full Name': app.studentFullName,
      'Email': app.studentEmail,
      'Phone': app.studentPhone,
      'Parent Phone': app.parentPhone,
      'Gender': app.gender,
      'DOB': app.dob,
      'State': app.state || 'N/A',
      'Father Name': app.fatherName,
      'Mother Name': app.motherName || 'N/A',
      'Age': app.age,
      'Caste': app.caste,
      'Aadhar Number': app.aadharNumber,
      'SSC Hall Ticket': app.sscHallTicket || 'N/A',
      'College Name': app.collegeName,
      'Branch': app.branch,
      'Roll Number': app.rollNumber,
      'Degree Percentage': app.degreePercentage,
      'Training Mode': app.trainingMode,
      'Company Name': app.companyName || 'N/A',
      'Course': app.course || 'N/A',
      'College ID Card': app.collegeIdCard?.url || 'N/A',
      'Aadhar Card Doc': app.aadharCard?.url || 'N/A',
      'SSC Memo Doc': app.sscMemo?.url || 'N/A',
      'Photo Doc': app.photo?.url || 'N/A',
      'Applied Date': new Date(app.createdAt).toLocaleDateString()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 22 }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Btech Internship');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const fileName = `Btech_Internship_${Date.now()}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
    try {
        await BtechInternship.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Btech application deleted.' });
    } catch (error) {
        next(error);
    }
};
