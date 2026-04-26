const mongoose = require('mongoose');

const btechInternshipSchema = new mongoose.Schema({
  // Step 1: Basic Details
  studentEmail: { type: String, required: true },
  studentFullName: { type: String, required: true },
  studentPhone: { type: String, required: true },
  parentPhone: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },

  // Step 2: Personal Details
  fatherName: { type: String, required: true },
  motherName: { type: String },
  age: { type: String, required: true },
  caste: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  sscHallTicket: { type: String },

  // NEW FIELD: State
  state: { type: String, required: true },

  // Step 3: College Details
  collegeName: { type: String, required: true },
  branch: { type: String, required: true },
  rollNumber: { type: String, required: true },
  degreePercentage: { type: String, required: true },

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

module.exports = mongoose.model('BtechInternship', btechInternshipSchema);
