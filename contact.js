const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle contact form submission
router.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@instaautobot.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router; 