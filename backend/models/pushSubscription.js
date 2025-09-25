const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
  userId: String,
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
