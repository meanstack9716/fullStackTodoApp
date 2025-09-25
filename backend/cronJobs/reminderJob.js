const cron = require('node-cron');
const webpush = require('web-push');
const Todo = require('../models/todo');
const PushSubscription = require('../models/pushSubscription');

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_USER}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const startReminderCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    const todos = await Todo.find({
      expireAt: { $gte: now, $lte: sixHoursLater },
      status: { $ne: 'Completed' }
    });

    const subscriptions = await PushSubscription.find();

    for (const todo of todos) {
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            sub,
            JSON.stringify({
              title: '📝 Task Reminder!',
              body: `${todo.title} is expiring in 6 hours!`,
              tag: 'todo-reminder'
            })
          );
        } catch (err) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log("Deleting expired subscription:", sub.endpoint);
            await PushSubscription.deleteOne({ endpoint: sub.endpoint });
          } else {
            console.error("Push error:", err);
          }
        }
      }
    }
  });
};

module.exports = startReminderCron;
