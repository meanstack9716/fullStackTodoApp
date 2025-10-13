const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const PushSubscription = require("../model/pushSubscriptionModel");
const router = express.Router();

//subscribe
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM Token required" });
    }
    const existing = await PushSubscription.findOne({ where: { fcmToken } });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }
    await PushSubscription.create({ fcmToken, userId });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.log("Subscription error:", err);
    res.status(500).json({ message: "server error" });
  }
}); 

//unsubscribe
router.post("/unsubscribe", authMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;
    if (!fcmToken) {
      return res.status(400).json({ message: "FCM Token required" });
    }
    await PushSubscription.destroy({ where: { fcmToken, userId } });
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (err) {
    console.log("Unsubscribe error:", err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router
