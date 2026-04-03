const nodemailer = require('nodemailer');

const sendReceiptEmail = async (studentDetails, paymentDetails) => {
  if (!studentDetails || !paymentDetails) {
    console.error('Email aborted: Missing data.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    // Fix for Render ENETUNREACH / IPv6 issues: force IPv4
    family: 4, 
    connectionTimeout: 10000, 
    greetingTimeout: 8000,
    socketTimeout: 15000
  });

  const mailOptions = {
    from: `"Svglobal Services" <${process.env.EMAIL_USER}>`,
    to: studentDetails.email,
    subject: 'Payment Successful - Svglobal Services',
    text: `Hi ${studentDetails.name}, your payment of ₹520 for ${studentDetails.course} is successful. Thank you.
    
Payment Details:
- Student Name: ${studentDetails.name}
- Email ID: ${studentDetails.email}
- Course: ${studentDetails.course}
- Amount: ₹520
- Payment ID: ${paymentDetails.razorpayPaymentId || 'N/A'}
- Status: Successful`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #1e3a8a;">Payment Successful</h2>
        <p>Hi <strong>${studentDetails.name}</strong>, your payment of <strong>₹520</strong> for <strong>${studentDetails.course}</strong> is successful. Thank you.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Student Name:</strong> ${studentDetails.name}</p>
          <p><strong>Email ID:</strong> ${studentDetails.email}</p>
          <p><strong>Course:</strong> ${studentDetails.course}</p>
          <p><strong>Amount:</strong> ₹520</p>
          <p><strong>Payment ID:</strong> ${paymentDetails.razorpayPaymentId || 'N/A'}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Successful</span></p>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">© 2026 Svglobal Services • Hyderabad • India</p>
      </div>
    `,

  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Receipt email sent to:', studentDetails.email);
  } catch (error) {
    console.error('Email Delivery Error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      studentEmail: studentDetails.email
    });
  }
};

module.exports = { sendReceiptEmail };
