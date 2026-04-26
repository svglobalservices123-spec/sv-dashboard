const DiplomaInternship = require('../models/DiplomaInternship');
const { uploadFileToDrive } = require('../utils/googleDrive');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Google Drive Folder ID (User should provide this)
// Google Drive Folder ID (User must provide this in .env)
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

exports.submitApplication = async (req, res, next) => {
  try {
    if (!FOLDER_ID || FOLDER_ID.includes('REPLACE_WITH_ACTUAL_ID')) {
      throw new Error('Google Drive Folder ID not configured on server.');
    }

    const {
      studentEmail, studentFullName, studentPhone, parentPhone, gender, dob, city,
      fatherName, motherName, age, caste, aadharNumber, sscHallTicket,
      collegeName, branch, rollNumber, gpa,
      trainingMode, companyName, course
    } = req.body;

    const files = req.files;
    if (!files || Object.keys(files).length < 4) {
      res.status(400);
      throw new Error('All 4 documents are required.');
    }

    // Upload files to Google Drive
    const uploadTasks = [];
    const docKeys = ['collegeIdCard', 'aadharCard', 'sscMemo', 'photo'];
    
    const uploadedDocs = {};

    for (const key of docKeys) {
      if (files[key] && files[key][0]) {
        const file = files[key][0];
        const fileName = `${studentFullName}_${key}_${Date.now()}${path.extname(file.originalname)}`;
        
        // We will process uploads sequentially or in parallel
        // Let's do parallel for speed
        uploadTasks.push(
          uploadFileToDrive(file.path, fileName).then(result => {

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

    const application = await DiplomaInternship.create({
      studentEmail, studentFullName, studentPhone, parentPhone, gender, dob, city,
      fatherName, motherName, age, caste, aadharNumber, sscHallTicket,
      collegeName, branch, rollNumber, gpa,
      trainingMode, companyName, course,
      ...uploadedDocs
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', applicationId: application._id });
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
    const { course, city } = req.query;
    let query = {};
    
    if (course && course !== 'all') {
      query.course = course;
    }
    // For city, we don't have a direct 'city' field in DiplomaInternship model based on user request.
    // However, they asked for "City wise" filter. I should probably add city or check where it comes from.
    // Looking at Step 1-5, City is NOT there. 
    // Wait, requirement 5 says "City (if available)". 
    // I'll add 'city' to the model just in case, or use 'collegeName' as a proxy if it contains city.
    // Actually, I'll add 'city' to the model in the next step.
    if (city && city !== 'all') {
        // Since city isn't in model yet, I'll just filter by collegeName for now or add it.
        // Let's add it to the model.
        query.city = { $regex: city, $options: 'i' };
    }

    const applications = await DiplomaInternship.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.getApplicationDetails = async (req, res, next) => {
  try {
    const application = await DiplomaInternship.findById(req.params.id);
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
    const { course, city } = req.query;
    let query = {};
    if (course && course !== 'all') query.course = course;
    if (city && city !== 'all') query.city = { $regex: city, $options: 'i' };

    const applications = await DiplomaInternship.find(query).sort({ createdAt: -1 });

    const data = applications.map(app => ({
      'Full Name': app.studentFullName,
      'Email': app.studentEmail,
      'Phone': app.studentPhone,
      'Parent Phone': app.parentPhone,
      'Gender': app.gender,
      'DOB': app.dob,
      'City': app.city || 'N/A',
      'Father Name': app.fatherName,
      'Mother Name': app.motherName || 'N/A',
      'Age': app.age,
      'Caste': app.caste,
      'Aadhar Number': app.aadharNumber,
      'SSC Hall Ticket': app.sscHallTicket || 'N/A',
      'College Name': app.collegeName,
      'Branch': app.branch,
      'Roll Number': app.rollNumber,
      'GPA': app.gpa,
      'Training Mode': app.trainingMode,
      'Company Name': app.companyName || 'N/A',
      'Course': app.course || 'N/A',
      'Applied Date': new Date(app.createdAt).toLocaleDateString()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Diploma Internship');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const fileName = `Diploma_Internship_${Date.now()}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
    try {
        await DiplomaInternship.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Application deleted.' });
    } catch (error) {
        next(error);
    }
};
