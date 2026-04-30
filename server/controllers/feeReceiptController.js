const FeeReceipt = require('../models/FeeReceipt');
const XLSX = require('xlsx');

// Create new fee receipt
exports.createFeeReceipt = async (req, res) => {
  try {
    const feeReceipt = new FeeReceipt(req.body);
    await feeReceipt.save();
    res.status(201).json({ success: true, data: feeReceipt });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all fee receipts with filters
exports.getFeeReceipts = async (req, res) => {
  try {
    const { startDate, endDate, collegeName, branch } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (collegeName) {
      query.collegeName = { $regex: collegeName, $options: 'i' };
    }

    if (branch) {
      query.branch = { $regex: branch, $options: 'i' };
    }

    const receipts = await FeeReceipt.find(query).sort({ createdAt: -1 });
    
    // Calculate totals
    const totalAmount = receipts.reduce((acc, curr) => acc + curr.amount, 0);
    
    res.status(200).json({
      success: true,
      count: receipts.length,
      totalAmount,
      data: receipts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export fee receipts to Excel
exports.exportToExcel = async (req, res) => {
  try {
    const receipts = await FeeReceipt.find().sort({ createdAt: -1 });
    
    const data = receipts.map(r => ({
      'Date': new Date(r.date).toLocaleDateString(),
      'Name': r.name,
      'Roll Number': r.rollNumber,
      'Branch': r.branch,
      'Phone': r.phone,
      'College Name': r.collegeName,
      'Purpose': r.purpose,
      'Payment Mode': r.paymentMode,
      'Amount': r.amount,
      'Created At': new Date(r.createdAt).toLocaleString()
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Receipts');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=fee_receipts.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
