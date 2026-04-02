const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { sendReceiptEmail } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createOrder = async (req, res, next) => {
  try {
    const { studentId, course } = req.body;
    const amountInPaise = 52000; // Fixed amount ₹520 = 52000 paise
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${studentId.toString().slice(-14)}_${Date.now().toString().slice(-4)}`,
    };
    const order = await razorpay.orders.create(options);

    // Create pending payment record
    await Payment.create({
      studentId,
      amount: 520, // Fixed ₹520
      razorpayOrderId: order.id,
      status: 'Pending'
    });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, studentId } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      const updatedPayment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, razorpaySignature, status: 'Paid' },
        { new: true }
      );
      
      const student = await Student.findById(studentId);
      if (student) {
        await sendReceiptEmail(student, updatedPayment);
      }
      
      res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'Failed' }
      );
      res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    next(error);
  }
};
