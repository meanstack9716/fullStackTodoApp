const cron = require('node-cron');
const Todo = require('../models/todo');

function startExpireCron() {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const result = await Todo.updateMany(
                { expireAt: { $lt: now }, status: { $ne: "Expired" } },
                { $set: { status: "Expired" } }
            );
            if (result.modifiedCount > 0) {
                console.log(`${result.modifiedCount} tasks marked as Expired`);
            }
        } catch (err) {
            console.error("Cron job error:", err);
        }
    });
}

module.exports = startExpireCron;
