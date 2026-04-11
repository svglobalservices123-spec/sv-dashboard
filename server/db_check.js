const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const students = await Student.find().sort({ createdAt: -1 }).limit(10);
    const fs = require('fs');
    fs.writeFileSync('db_check_out.txt', JSON.stringify(students, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
