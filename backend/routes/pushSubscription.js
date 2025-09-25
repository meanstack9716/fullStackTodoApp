const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/pushSubscription');

router.post('/subscribe', async (req, res) => {
  try {
    const { endpoint, keys, userId } = req.body;
    const existing = await PushSubscription.findOne({ endpoint });
    if (existing) return res.status(200).json({ message: 'Already subscribed' });

    const subscription = new PushSubscription({ endpoint, keys, userId });
    await subscription.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
