import nodemailer from "nodemailer";

// For testing - create a test account automatically
async function createTestTransporter() {
  // Create a test account on ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  console.log("Ethereal test account created:");
  console.log("Email:", testAccount.user);
  console.log("Password:", testAccount.pass);
  console.log("Web interface: https://ethereal.email");

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Create transporter (use test for development, real for production)
let transporter: nodemailer.Transporter;

if (
  process.env.NODE_ENV === "production" &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD
) {
  // Use real email in production
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Use test email in development
  createTestTransporter()
    .then((testTransporter) => {
      transporter = testTransporter;
    })
    .catch(console.error);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  // Ensure transporter is ready
  if (!transporter) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  //   const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const resetUrl = `${
    process.env.NEXTAUTH_URL
  }/auth/reset-password?token=${encodeURIComponent(token)}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"AI Quiz Platform" <noreply@aiquiz.com>',
    to: email,
    subject: "Reset Your Password - AI Quiz Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for your AI Quiz Platform account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${resetUrl}
        </p>
      </div>
    `,
    text: `Reset your password by visiting this link: ${resetUrl}\n\nThis link will expire in 1 hour.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
}
