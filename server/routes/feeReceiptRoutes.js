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
router.get('/:id', getFeeReceiptById);
router.put('/:id', updateFeeReceipt);
router.delete('/:id', deleteFeeReceipt);
router.get('/export', exportToExcel);

module.exports = router;
