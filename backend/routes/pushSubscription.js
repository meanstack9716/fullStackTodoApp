const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/pushSubscription');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Subscribe
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;
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
router.post('/unsubscribe', authMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;
    if (!fcmToken) return res.status(400).json({ message: 'fcmToken required' });
    await PushSubscription.deleteOne({ fcmToken, userId });
    res.status(200).json({ message: 'Unsubscribed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
