const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  instagramAccounts: [{
    username: String,
    accessToken: String,
    refreshToken: String,
    lastSync: Date
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date
  },
  notificationSettings: {
    notifyDMs: {
      type: Boolean,
      default: true
    },
    notifySubscription: {
      type: Boolean,
      default: true
    },
    notifySecurity: {
      type: Boolean,
      default: true
    },
    notifySystem: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 