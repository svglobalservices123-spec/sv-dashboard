const express = require('express');
const router = express.Router();
const {
  createFeeReceipt,
  getFeeReceipts,
  exportToExcel
} = require('../controllers/feeReceiptController');

router.post('/', createFeeReceipt);
router.get('/', getFeeReceipts);
router.get('/export', exportToExcel);

module.exports = router;
