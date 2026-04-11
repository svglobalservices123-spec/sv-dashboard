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
    const amountInPaise = 58900; // Updated amount ₹589 = 58900 paise
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${studentId.toString().slice(-14)}_${Date.now().toString().slice(-4)}`,
    };
    const order = await razorpay.orders.create(options);

    // Create pending payment record
    await Payment.create({
      studentId,
      amount: 589, // Updated amount ₹589
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
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      studentId 
    } = req.body;
    
    const fs = require('fs');
    fs.appendFileSync('debug_verify.txt', `${new Date().toISOString()} - Verify attempt for: ${studentId}, Order: ${razorpay_order_id}\n`);

    console.log('✅ Verifying Payment for:', { razorpayOrderId: razorpay_order_id, studentId });

    // Support both if needed, but prefer snake_case
    const razorpayOrderId = razorpay_order_id || req.body.razorpayOrderId;
    const razorpayPaymentId = razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpaySignature = razorpay_signature || req.body.razorpaySignature;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
       console.error('Missing Razorpay credentials in request');
       return res.status(400).json({ success: false, message: 'Missing Razorpay credentials in request.' });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      console.log('✅ Signature verified successfully.');
      
      const updatedPayment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, razorpaySignature, status: 'Paid' },
        { new: true }
      );
      
      if (!updatedPayment) {
        console.warn('⚠️ Payment record not found for Order ID:', razorpayOrderId);
      } else {
        console.log('✅ Payment record updated to Paid.');
      }

      console.log('🔍 Looking for student with ID:', studentId);
      const student = await Student.findById(studentId);
      
      if (student) {
        fs.appendFileSync('debug_verify.txt', `${new Date().toISOString()} - Student found: ${student.email}\n`);
        console.log('✅ Student found:', student.email);
        // Trigger email sending
        sendReceiptEmail(student, updatedPayment || { razorpayPaymentId })
          .then(() => {
            console.log('📧 Success email triggered successfully.');
            fs.appendFileSync('debug_verify.txt', `${new Date().toISOString()} - Email triggered successfully\n`);
          })
          .catch(err => {
            console.error('❌ Email trigger failed:', err);
            fs.appendFileSync('debug_verify.txt', `${new Date().toISOString()} - Email trigger FAILED: ${err.message}\n`);
          });
      } else {
        console.error('❌ Student NOT found for ID:', studentId);
        fs.appendFileSync('debug_verify.txt', `${new Date().toISOString()} - Student NOT FOUND for ID: ${studentId}\n`);
      }
      
      return res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      console.error('Signature Mismatch!');
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'Failed' }
      );
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    next(error);
  }
};
