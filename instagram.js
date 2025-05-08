const express = require('express');
const router = express.Router();
const { IgApiClient } = require('instagram-private-api');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Initialize Instagram API client
const ig = new IgApiClient();

// Connect Instagram account
router.post('/connect', auth, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Store credentials in user document
    const user = await User.findById(req.user.id);
    user.instagramUsername = username;
    await user.save();

    // Initialize Instagram client
    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    res.json({ message: 'Instagram account connected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error connecting Instagram account' });
  }
});

// Set up auto-replies
router.post('/auto-reply', auth, async (req, res) => {
  try {
    const { message, keywords } = req.body;
    const user = await User.findById(req.user.id);

    // Check subscription limits
    if (user.subscription === 'free' && user.dmCount >= 50) {
      return res.status(403).json({ message: 'Monthly DM limit reached. Please upgrade your plan.' });
    }

    // Store auto-reply configuration
    user.autoReply = {
      message,
      keywords,
      isActive: true
    };
    await user.save();

    res.json({ message: 'Auto-reply configured successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error configuring auto-reply' });
  }
});

// Get DM statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      dmCount: user.dmCount,
      subscription: user.subscription,
      remainingDMs: user.subscription === 'free' ? Math.max(0, 50 - user.dmCount) : 'unlimited'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router; 