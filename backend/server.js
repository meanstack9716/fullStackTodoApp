const express = require('express')
const app = express();
const db = require('./db');
const cors = require("cors");
const startExpireCron = require('./cronJobs/expireTodos');
const startReminderCron = require('./cronJobs/reminderJob');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes')
const pushRoutes = require('./routes/pushSubscription');

app.use('/user', authRoutes)
app.use('/todos', todoRoutes)
app.use('/push', pushRoutes);

app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
      startExpireCron();
      startReminderCron();
})
