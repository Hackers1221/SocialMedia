const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const url = "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741879576/socialMedia/images/1741879571244-Logo.png.png"
const webpage = "http://localhost:5173/"
const resetLink = "http://localhost:5173/resetpass"
const login = "http://localhost:5173/login"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

const sendOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"DropChat" <${EMAIL}>`, // Sender email
      to: email, // Receiver email
      subject: "Your OTP Code for Verification",
      text: `Your OTP is: ${otp}`, // Fallback for email clients that don't support HTML
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333;">Verify Your Email</h2>
        <p style="font-size: 16px; text-align: center; color: #555;">Use the OTP below to verify your email address.</p>
        <div style="text-align: center; padding: 10px; font-size: 24px; font-weight: bold; background-color: #f4f4f4; border-radius: 5px; width: 200px; margin: auto;">
          ${otp}
        </div>
        <p style="text-align: center; color: #777;">This OTP is valid for 10 minutes.</p>
        <p style="text-align: center; font-size: 14px; color: #999;">If you did not request this, please ignore this email.</p>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info };
  } catch (error) {
    console.log("Error sending OTP:", error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"DropChat" <${EMAIL}>`,
      to: email,
      subject: "Welcome to DropChat!",
      text: "Welcome to DropChat! We're excited to have you on board. Start exploring and connecting with friends today!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); text-align: center; background-color: #f9f9f9;">
        <div style="width: 100%; text-align: center; margin-bottom: 15px;">
          <table style="margin: 0 auto;">
              <tr>
                  <td>
                      <img src="${url}" alt="Welcome Image" style="width: 2.5rem; border-radius: 50%;"/>
                  </td>
                  <td>
                      <h2 style="color: #023e8a; margin: 0; white-space: nowrap;">Welcome to DropChat!</h2>
                  </td>
              </tr>
          </table>
      </div>

        <p style="font-size: 16px; color: #555; margin-bottom: 10px;">We're thrilled to have you on board.</p>
        <p style="font-size: 14px; color: #777; margin-bottom: 20px;">
            Start exploring, connecting, and enjoying your new social experience.
        </p>

        <div style="margin-top: 20px;">
            <a href="${webpage}" 
              style="display: inline-block; background-color: #023e8a; color: #fff; text-decoration: none; 
                      padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                Get started
            </a>
        </div>

        <p style="font-size: 12px; color: #999; margin-top: 20px;">
            If you have any questions, feel free to reach out to our support team.
        </p>
    </div>

      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

const forgetPasswordLink = async (email) => {
  try {
    const mailOptions = {
      from: `"DropChat" <${EMAIL}>`,
      to: email,
      subject: "Reset Your Password - DropChat",
      text: `You requested a password reset. Click the link below to reset your password: ${resetLink}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); text-align: center; background-color: #f9f9f9;">
        <h2 style="color: #023e8a;">Reset Your Password</h2>
        
        <p style="font-size: 16px; color: #555;">We received a request to reset your DropChat password.</p>
        <p style="font-size: 14px; color: #777;">
            Click the button below to set a new password. If you did not request this, please ignore this email.
        </p>

        <div style="margin-top: 20px;">
            <a href="${resetLink}" 
              style="display: inline-block; background-color: #023e8a; color: #fff; text-decoration: none; 
                      padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
        </div>

        <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This link will expire in 1 hour for security reasons.
        </p>

        <p style="font-size: 12px; color: #999;">
            If you have any issues, contact our support team.
        </p>
    </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

const passwordChangedEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"DropChat" <${EMAIL}>`,
      to: email,
      subject: "Your Password Has Been Successfully Changed - DropChat",
      text: `Hello,

Your password has been successfully changed. If you made this change, no further action is needed.

If you did not request this change, please reset your password immediately or contact our support team.

Stay safe,
The DropChat Team
`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); text-align: center; background-color: #f9f9f9;">
        <h2 style="color: #023e8a;">Password Changed Successfully</h2>
        
        <p style="font-size: 16px; color: #555;">Your password has been updated successfully.</p>
        <p style="font-size: 14px; color: #777;">
            If you made this change, no further action is required.
        </p>

        <p style="font-size: 14px; color: #777;">
            However, if you did not request this change, please 
            <a href="${resetLink}" style="color: #023e8a; text-decoration: none; font-weight: bold;">reset your password</a> 
            immediately or contact our support team.
        </p>

        <p style="font-size: 12px; color: #999; margin-top: 20px;">
            Stay safe, <br> The DropChat Team
        </p>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Error sending password changed confirmation email:", error);
    return { success: false, error: error.message };
  }
};



module.exports = {
    sendOtp,
    sendWelcomeEmail,
    forgetPasswordLink,
    passwordChangedEmail
};