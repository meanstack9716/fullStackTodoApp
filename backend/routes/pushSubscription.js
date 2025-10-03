const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/pushSubscription');

// Subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { fcmToken, userId } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'fcmToken required' });

    const existing = await PushSubscription.findOne({ fcmToken });
    if (existing) return res.status(200).json({ message: 'Already subscribed' });

    await PushSubscription.create({ fcmToken, userId });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'fcmToken required' });
    await PushSubscription.deleteOne({ fcmToken });
    res.status(200).json({ message: 'Unsubscribed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
