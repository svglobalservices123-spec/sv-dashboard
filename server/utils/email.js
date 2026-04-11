const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendReceiptEmail = async (student, payment) => {
  try {
    if (!student) {
      console.error('Email error: Missing student details.');
      return;
    }

    const appId = student.applicationId || 'N/A';

    const { data, error } = await resend.emails.send({
      from: 'Svglobal Services <onboarding@resend.dev>',
      to: student.email,
      subject: `Internship Registration Successful – Application No. ${appId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; color: #1e293b; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px 24px; background-color: #1e3a8a; color: white; border-radius: 12px; font-weight: bold; font-size: 20px;">
              SV GLOBAL SERVICES
            </div>
          </div>

          <h2 style="color: #1e3a8a; margin-top: 0;">Congratulations! 🎉</h2>
          
          <p>Dear <strong>${student.name}</strong>,</p>
          
          <p>You have successfully registered for the <strong>Internship Program</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1.5px dashed #cbd5e1; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your Application Number</p>
            <p style="margin: 10px 0 0 0; font-size: 28px; color: #1e3a8a; font-weight: 900; letter-spacing: 2px;">${appId}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">(Note: Please keep this number safe for future reference.)</p>
          </div>
          
          <p>We are excited to have you onboard. Our team will review your application and share further details regarding your internship, including schedule, onboarding process, and next steps.</p>
          
          <p>If you have any questions or need assistance, feel free to reach out to us.</p>
          
          <p>Thank you for choosing us.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-t: 1px solid #e2e8f0; font-size: 14px; color: #475569;">
            <p style="margin: 5px 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0; font-weight: bold; color: #1e3a8a;">SV GLOBAL SERVICES</p>
            <p style="margin: 5px 0;">📞 +91 7995586120</p>
            <p style="margin: 5px 0;">📧 info@svglobalservices.com</p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
            © 2026 Svglobal Services • Professional Internship Training
          </div>
        </div>
      `,
    });

    if (error) {
      return console.error('Resend sending error:', error);
    }

    console.log('Success email sent via Resend to:', student.email, 'AppID:', appId);
  } catch (error) {
    console.error('Fatal Email Error:', error);
  }
};

module.exports = { sendReceiptEmail };
