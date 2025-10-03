const cron = require('node-cron');
const admin = require('../config/firebaseAdmin');
const Todo = require('../models/todo');
const PushSubscription = require('../models/pushSubscription');

const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

const startReminderCron = () => {
    cron.schedule('*/2 * * * *', async () => {
        try {
            const now = new Date();
            const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

            const todos = await Todo.find({
                expireAt: { $gte: now, $lte: sixHoursLater },
                status: { $ne: 'Completed' },
            });
            if (!todos.length) return;

            const subs = await PushSubscription.find();
            const tokens = subs.map(s => s.fcmToken).filter(Boolean);
            if (!tokens.length) return;

            for (const todo of todos) {
                const notification = {
                    notification: {
                        title: '📝 Task Reminder!',
                        body: `${todo.title} is expiring in 6 hours!`,
                    },
                    webpush: {
                        headers: { TTL: `${6 * 60 * 60}` },
                        notification: { tag: 'todo-reminder' },
                    },
                    android: { priority: 'high' },
                    apns: { payload: { aps: { sound: 'default' } } },
                };

                const tokenChunks = chunk(tokens, 500);
                for (const chunkTokens of tokenChunks) {
                    const res = await admin.messaging().sendEachForMulticast({
                        tokens: chunkTokens,
                        notification: notification.notification,
                        webpush: notification.webpush,
                        android: notification.android,
                        apns: notification.apns,
                    });

                    res.responses.forEach((r, idx) => {
                        if (!r.success) {
                            const err = r.error;
                            const badToken = chunkTokens[idx];
                            if (err && (err.code === 'messaging/registration-token-not-registered' || err.code === 'messaging/invalid-registration-token')) {
                                PushSubscription.deleteOne({ fcmToken: badToken }).catch(console.error);
                            } else {
                                console.warn('FCM message error:', err?.code || err);
                            }
                        }
                    });
                    console.log("FCM Result:", res.successCount, "success,", res.failureCount, "failed");
                }
            }
        } catch (err) {
            console.error('Cron job error:', err);
        }
    });
};

module.exports = startReminderCron;
