const nodemailer = require("nodemailer");
require('dotenv').config()

const sendMail = async (to, subject ,text , html) => {

  // Create a transporter using Gmail SMTP
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.gmail_id,
      pass: process.env.gmail_pass
    },
  });

  // Rest of your email sending code
  // ...

  // Send the email
   await transporter.sendMail({
    from:  process.env.gmail_id, // Sender's address
    to: to, // Recipient's address
    subject: subject, // Subject line
    text: text, // Plain text body
    html // HTML body
  });
};

module.exports = sendMail;