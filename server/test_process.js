const axios = require('axios');

async function test() {
  try {
    const studentRes = await axios.post('http://localhost:5000/api/students', {
      name: "Test Automation",
      phone: "9876543210",
      email: "test@auto.com",
      course: "React Fullstack"
    });
    const studentId = studentRes.data.studentId;
    console.log('✅ Student Created:', studentId);

    const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', {
      amount: 5000,
      studentId: studentId
    });
    console.log('✅ Razorpay Order Result:', orderRes.data);

    if (orderRes.data.success) {
      console.log('🚀 SYSTEM TEST PASSED: Full E2E logic confirmed.');
    }
  } catch (err) {
    console.error('❌ TEST FAILED:', err.response?.data || err.message);
  }
}

test();
