const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force using Google DNS to bypass ISP SRV lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Student = require('./models/Student');
const Payment = require('./models/Payment');

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const students = await Student.find({ createdAt: { $gte: startOfDay } });
        console.log('Today Students:', JSON.stringify(students, null, 2));

        const payments = await Payment.find({ createdAt: { $gte: startOfDay } });
        console.log('Today Payments:', JSON.stringify(payments, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
