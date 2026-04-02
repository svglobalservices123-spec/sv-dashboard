const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const dns = require('dns');

// Force using Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // For port 587, use false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Sometimes helps with network restrictions
    }
});

const mailOptions = {
    from: `"Svglobal Services" <${process.env.EMAIL_USER}>`,
    to: 'tarunballa22@gmail.com',
    subject: 'Test Email - Svglobal Services',
    text: 'This is a test email to verify the SMTP configuration on port 587.',
};

async function send() {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        process.exit(0);
    } catch (error) {
        console.error('Error sending email:', error);
        process.exit(1);
    }
}

send();
