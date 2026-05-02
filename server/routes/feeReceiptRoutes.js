const express = require('express');
const router = express.Router();
const {
  createFeeReceipt,
  getFeeReceipts,
  getFeeReceiptById,
  updateFeeReceipt,
  exportToExcel
} = require('../controllers/feeReceiptController');

router.post('/', createFeeReceipt);
router.get('/', getFeeReceipts);
router.get('/:id', getFeeReceiptById);
router.put('/:id', updateFeeReceipt);
router.get('/export', exportToExcel);

module.exports = router;
