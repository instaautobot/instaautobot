const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create subscription
router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user.id);

    // Define plan prices
    const prices = {
      pro: 'price_pro_plan_id', // Replace with actual Stripe price ID
      elite: 'price_elite_plan_id' // Replace with actual Stripe price ID
    };

    if (!prices[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      source: req.body.token
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: prices[plan] }]
    });

    // Update user subscription
    user.subscription = plan;
    user.stripeCustomerId = customer.id;
    user.stripeSubscriptionId = subscription.id;
    await user.save();

    res.json({ message: 'Subscription created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error creating subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(user.stripeSubscriptionId);

    // Update user subscription
    user.subscription = 'free';
    user.stripeSubscriptionId = null;
    await user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
});

module.exports = router; 