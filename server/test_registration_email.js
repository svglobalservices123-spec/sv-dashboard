require('dotenv').config();
const { sendReceiptEmail } = require('./utils/email');

const dummyStudent = {
    name: 'Test Candidate',
    email: 'info@svglobalservices.com',
    applicationId: '112032026999',
    course: 'AI'
};

const dummyPayment = {
    razorpayPaymentId: 'pay_test_12345'
};

async function runTest() {
    console.log('Starting Email Test...');
    try {
        await sendReceiptEmail(dummyStudent, dummyPayment);
        console.log('Test execution finished.');
    } catch (error) {
        console.error('Test execution failed:', error);
    }
}

runTest();
