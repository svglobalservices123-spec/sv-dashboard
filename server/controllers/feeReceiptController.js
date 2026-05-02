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

// Get single fee receipt by ID
exports.getFeeReceiptById = async (req, res) => {
  try {
    const receipt = await FeeReceipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update fee receipt
exports.updateFeeReceipt = async (req, res) => {
  try {
    const receipt = await FeeReceipt.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete fee receipt
exports.deleteFeeReceipt = async (req, res) => {
  try {
    const receipt = await FeeReceipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.status(200).json({ success: true, message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all fee receipts with filters
exports.getFeeReceipts = async (req, res) => {
  try {
    const { startDate, endDate, collegeName, branch, name } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (collegeName) {
      query.collegeName = { $regex: collegeName, $options: 'i' };
    }

    if (branch) {
      query.branch = { $regex: branch, $options: 'i' };
    }

    const receipts = await FeeReceipt.find(query).sort({ createdAt: -1 });
    
    // Calculate totals
    const totalAmount = receipts.reduce((acc, curr) => acc + (curr.paidFee !== undefined ? curr.paidFee : (curr.amount || 0)), 0);
    
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

// Export fee receipts to Excel with filters
exports.exportToExcel = async (req, res) => {
  try {
    const { startDate, endDate, collegeName, branch, name } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (collegeName) {
      query.collegeName = { $regex: collegeName, $options: 'i' };
    }

    if (branch) {
      query.branch = { $regex: branch, $options: 'i' };
    }

    const receipts = await FeeReceipt.find(query).sort({ createdAt: -1 });
    
    const data = receipts.map(r => ({
      'Date': r.date ? new Date(r.date).toLocaleDateString() : 'N/A',
      'Name': r.name || 'N/A',
      'Roll Number': r.rollNumber || 'N/A',
      'Branch': r.branch || 'N/A',
      'Phone': r.phone || 'N/A',
      'College Name': r.collegeName || 'N/A',
      'Purpose': r.purpose || 'N/A',
      'Payment Mode': r.paymentMode || 'N/A',
      'Paid Fee': r.paidFee !== undefined ? r.paidFee : (r.amount || 0),
      'Due': r.due !== undefined ? r.due : 0,
      'Total Fee': r.totalFee !== undefined ? r.totalFee : (r.amount || 0),
      'Created At': r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add column widths for better readability
    const wscols = [
      { wch: 15 }, // Date
      { wch: 25 }, // Name
      { wch: 20 }, // Roll Number
      { wch: 15 }, // Branch
      { wch: 15 }, // Phone
      { wch: 30 }, // College Name
      { wch: 20 }, // Purpose
      { wch: 15 }, // Payment Mode
      { wch: 12 }, // Paid Fee
      { wch: 12 }, // Due
      { wch: 12 }, // Total Fee
      { wch: 20 }  // Created At
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Receipts');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=fee_receipts.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
