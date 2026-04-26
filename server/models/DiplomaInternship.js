const mongoose = require('mongoose');

const diplomaInternshipSchema = new mongoose.Schema({
  // Step 1: Basic Details
  studentEmail: { type: String, required: true },
  studentFullName: { type: String, required: true },
  studentPhone: { type: String, required: true },
  parentPhone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  city: { type: String }, // Added for filtering/admin requirements
  state: { type: String }, // Added per new requirement


  // Step 2: Personal Details
  fatherName: { type: String, required: true },
  motherName: { type: String },
  age: { type: String, required: true },
  caste: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  sscHallTicket: { type: String },

  // Step 3: College Details
  collegeName: { type: String, required: true },
  branch: { type: String, required: true },
  rollNumber: { type: String, required: true },
  gpa: { type: String, required: true },

  // Step 4: Training Details
  trainingMode: { type: String, required: true },
  companyName: { type: String },
  course: { type: String },

  // Step 5: Upload Documents (Drive URLs/IDs)
  collegeIdCard: {
    id: String,
    url: String
  },
  aadharCard: {
    id: String,
    url: String
  },
  sscMemo: {
    id: String,
    url: String
  },
  photo: {
    id: String,
    url: String
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiplomaInternship', diplomaInternshipSchema);
