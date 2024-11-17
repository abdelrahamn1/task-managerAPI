const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Mailtrap SMTP server
  port: 587, // Mailtrap SMTP port
  auth: {
    user: process.env.EMAIL_USER, // Your Mailtrap SMTP user
    pass: process.env.EMAIL_PASS, // Your Mailtrap SMTP password
  },
});

// Function to send email
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL, // Sender address
    to: options.email, // Receiver address
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
  };

  try {
    // Send email using the transporter
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There was an error sending the email. Try again later!");
  }
};

module.exports = sendEmail;
