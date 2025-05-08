const nodemailer = require('nodemailer');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  dm: {
    subject: 'New DM Activity on InstaAutoBot',
    template: (data) => `
      <h2>New DM Activity</h2>
      <p>You have received ${data.count} new direct messages on Instagram.</p>
      <p>Auto-replies sent: ${data.autoReplies}</p>
      <p>View your dashboard for more details: <a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a></p>
    `
  },
  subscription: {
    subject: 'Subscription Update - InstaAutoBot',
    template: (data) => `
      <h2>Subscription Update</h2>
      <p>Your subscription status has been updated.</p>
      <p>New plan: ${data.plan}</p>
      <p>Status: ${data.status}</p>
      <p>Manage your subscription: <a href="${process.env.FRONTEND_URL}/dashboard#billing">Billing Settings</a></p>
    `
  },
  security: {
    subject: 'Security Alert - InstaAutoBot',
    template: (data) => `
      <h2>Security Alert</h2>
      <p>${data.message}</p>
      <p>If this wasn't you, please secure your account immediately.</p>
      <p>Visit your security settings: <a href="${process.env.FRONTEND_URL}/dashboard#settings">Security Settings</a></p>
    `
  },
  system: {
    subject: 'System Update - InstaAutoBot',
    template: (data) => `
      <h2>System Update</h2>
      <p>${data.message}</p>
      <p>Learn more: <a href="${process.env.FRONTEND_URL}/updates">System Updates</a></p>
    `
  }
};

// Send notification
async function sendNotification(userId, type, data) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Create notification record
    const notification = new Notification({
      user: userId,
      type,
      title: emailTemplates[type].subject,
      message: data.message || 'New notification'
    });
    await notification.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: emailTemplates[type].subject,
      html: emailTemplates[type].template(data)
    };

    await transporter.sendMail(mailOptions);
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

// Notification types
const notifications = {
  // DM notifications
  newDMs: async (userId, count, autoReplies) => {
    return sendNotification(userId, 'dm', { count, autoReplies });
  },

  // Subscription notifications
  subscriptionUpdate: async (userId, plan, status) => {
    return sendNotification(userId, 'subscription', { plan, status });
  },

  // Security notifications
  securityAlert: async (userId, message) => {
    return sendNotification(userId, 'security', { message });
  },

  // System notifications
  systemUpdate: async (userId, message) => {
    return sendNotification(userId, 'system', { message });
  }
};

module.exports = notifications; 