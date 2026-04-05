const axios = require('axios');

async function testBackend() {
  const url = 'https://sv-backend-85bf.onrender.com/api/students';
  console.log(`Testing POST to: ${url}`);
  try {
    const start = Date.now();
    const res = await axios.post(url, {
      name: "Debug User",
      phone: "1234567890",
      email: "debug@test.com",
      branch: "CSE",
      rollNumber: "ROLL123",
      collegeName: "Debug College",
      location: "Debug City",
      course: "AI"
    });
    const duration = (Date.now() - start) / 1000;
    console.log(`✅ Success in ${duration}s!`);
    console.log('Response:', res.data);
  } catch (err) {
    console.error('❌ Failed:', err.response?.data || err.message);
  }
}

testBackend();
