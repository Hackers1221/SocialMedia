const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const url = "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1741879576/socialMedia/images/1741879571244-Logo.png.png"

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
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <div style="display: flex; width: full align-items: center; justify-content: center; gap: 10px;">
          <img src="${url}" alt="Welcome Image" style="width: 40px; height: 40px; border-radius: 50%;">
          <h2 style="color: #333; margin: 0;">Welcome to DropChat!</h2>
        </div>
        <p style="font-size: 16px; text-align: center; color: #555;">We're excited to have you on board.</p>
        <p style="text-align: center; font-size: 14px; color: #777;">Start exploring, connecting, and enjoying your new social experience.</p>
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


module.exports = {
    sendOtp,
    sendWelcomeEmail
};