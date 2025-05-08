const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Notification = require('../models/Notification');
const notifications = require('../services/notificationService');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const userNotifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(userNotifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Update notification settings
router.post('/settings', auth, async (req, res) => {
  try {
    const { notifyDMs, notifySubscription, notifySecurity, notifySystem } = req.body;
    
    const user = await User.findById(req.user.id);
    user.notificationSettings = {
      notifyDMs,
      notifySubscription,
      notifySecurity,
      notifySystem
    };
    await user.save();

    res.json({ message: 'Notification settings updated successfully' });
  } catch (err) {
    console.error('Error updating notification settings:', err);
    res.status(500).json({ message: 'Error updating notification settings' });
  }
});

// Mark notification as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

module.exports = router; 