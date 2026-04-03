const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendReceiptEmail = async (student, payment) => {
  try {
    if (!student || !payment) {
      console.error('Resend error: Missing student or payment details.');
      return;
    }

    const { data, error } = await resend.emails.send({
      from: 'Svglobal Services <onboarding@resend.dev>',
      to: student.email,
      subject: 'Payment Successful - Svglobal Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">Payment Successful</h2>
          <p>Hi <strong>${student.name}</strong>, your payment of <strong>₹520</strong> for <strong>${student.course}</strong> is successful. Thank you.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <p><strong>Student Name:</strong> ${student.name}</p>
            <p><strong>Email ID:</strong> ${student.email}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Amount:</strong> ₹520</p>
            <p><strong>Payment ID:</strong> ${payment.razorpayPaymentId || 'N/A'}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Successful</span></p>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">© 2026 Svglobal Services • Hyderabad • India</p>
        </div>
      `,
    });

    if (error) {
      return console.error('Resend sending error:', error);
    }

    console.log('Receipt email sent via Resend to:', student.email, 'ID:', data.id);
  } catch (error) {
    console.error('Fatal Resend Error:', error);
  }
};

module.exports = { sendReceiptEmail };
