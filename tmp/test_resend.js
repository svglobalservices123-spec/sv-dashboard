const dotenv = require('dotenv');
const { sendReceiptEmail } = require('../server/utils/email');

dotenv.config({ path: '../server/.env' });

async function testResend() {
  console.log('--- Testing Resend Configuration ---');
  console.log('Using API Key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');

  const mockStudent = {
    name: 'Test Student',
    email: 'tarunballa22@gmail.com', // Replace with your email to test real delivery
    course: 'AI Development'
  };

  const mockPayment = {
    amount: 520,
    razorpayPaymentId: 'pay_test123'
  };

  try {
    await sendReceiptEmail(mockStudent, mockPayment);
    console.log('✅ sendReceiptEmail function executed. Check console for Resend response.');
  } catch (error) {
    console.error('❌ Resend test function failed:', error);
  }
}

testResend();
