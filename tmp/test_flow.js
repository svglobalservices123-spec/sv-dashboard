const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testFlow() {
  try {
    console.log('--- Testing API Flow ---');

    // 1. Create Student
    console.log('1. Creating student...');
    const studentData = {
      name: 'Test Student',
      phone: '9876543210',
      email: 'test@example.com',
      branch: 'CSE',
      rollNumber: 'ROLL123',
      collegeName: 'Test College',
      location: 'Hyderabad',
      course: 'AI'
    };
    const res1 = await axios.post(`${API_URL}/students`, studentData);
    const studentId = res1.data.studentId;
    console.log('✅ Student created with ID:', studentId);

    // 2. Create Razorpay Order
    console.log('2. Creating Razorpay order...');
    const res2 = await axios.post(`${API_URL}/create-order`, {
      studentId,
      course: 'AI'
    });
    console.log('✅ Order created:', res2.data.order.id);

    // 3. Verify Payment (Mock)
    // Note: We can't actually verify a real signature here without valid payment ID,
    // but we can check if the endpoint responds correctly to a bad signature.
    console.log('3. Testing verify-payment endpoint (expecting 400)...');
    try {
      await axios.post(`${API_URL}/verify-payment`, {
        razorpay_order_id: res2.data.order.id,
        razorpay_payment_id: 'pay_mock123',
        razorpay_signature: 'fake_sig',
        studentId
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('✅ Endpoint responded with 400 as expected for fake signature.');
      } else {
        console.error('❌ Unexpected response from verify-payment:', err.message);
      }
    }

    console.log('\n--- Test Completed Successfully ---');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFlow();
