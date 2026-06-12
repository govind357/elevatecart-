import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires in 10 minutes.</p>
      `,
    });
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.warn(`[WARNING] Failed to send OTP email to ${email}. (This is expected in local development if real email credentials are not configured).`);
    console.log(`\n========================================`);
    console.log(`  VERIFICATION OTP FOR ${email}: ${otp}`);
    console.log(`========================================\n`);
  }
};