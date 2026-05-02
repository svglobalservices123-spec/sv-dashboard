const mongoose = require('mongoose');

const feeReceiptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  branch: { type: String, required: true },
  phone: { type: String, required: true },
  collegeName: { type: String, required: true },
  purpose: { type: String, required: true },
  paymentMode: { type: String, enum: ['Online', 'Cash'], required: true },
  paidFee: { type: Number, required: true },
  due: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeReceipt', feeReceiptSchema, 'studentFeeReceipts');
