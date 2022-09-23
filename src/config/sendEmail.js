require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = {
  sendVerificationEmail: async (userAddress, link) => {
    let success = true;
    console.log(process.env.MAIL_PASSWORD)
    try {
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    
      const info = await transporter.sendMail({
        from: `"Drag & Drop List Ranker" <${process.env.MAIL_USER}>`,
        to: userAddress,
        subject: "Verify Email Address",
        html: `Please verify your email by clicking <a href='${link}'>here</a>.<br>
        This link will only be valid for 7 days.`,
      });
    } catch (error) {
      console.log(error);
      success = false;
    }

    return success;
  },

  sendForgotPasswordEmail: async (userAddress, link) => {
    let success = true;
    try {
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    
      const info = await transporter.sendMail({
        from: `"Drag & Drop Ranker" <${process.env.MAIL_USER}>`,
        to: userAddress,
        subject: "Reset Your Password",
        html: `Reset your password by clicking on the link <a href='${link}'>here</a>.<br>
        This link will only be valid for 24hrs.`,
      });
    } catch (error) {
      success = false;
    }

    return success;
  }
}