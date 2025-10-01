const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  fcmToken: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);

