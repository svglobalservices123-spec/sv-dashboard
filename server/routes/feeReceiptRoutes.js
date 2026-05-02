const express = require('express');
const router = express.Router();
const {
  createFeeReceipt,
  getFeeReceipts,
  getFeeReceiptById,
  updateFeeReceipt,
  deleteFeeReceipt,
  exportToExcel
} = require('../controllers/feeReceiptController');

router.post('/', createFeeReceipt);
router.get('/', getFeeReceipts);
router.get('/export', exportToExcel);
router.get('/:id', getFeeReceiptById);
router.put('/:id', updateFeeReceipt);
router.delete('/:id', deleteFeeReceipt);

module.exports = router;
