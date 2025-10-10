const express = require('express')
const app = express();
const db = require('./db');
const cors = require("cors");
const startExpireCron = require('./cronJobs/expireTodos');
const startReminderCron = require('./cronJobs/startReminder');

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
const { dbConnection } = require("./config/dbConnect");
const User = require("./model/userModel");
const mysqlAuthRoutes = require("./routes/mysqlAuthRoutes");

app.use('/user', authRoutes)
app.use('/todos', todoRoutes)
app.use('/push', pushRoutes);
app.use("/mysql-user", mysqlAuthRoutes); 

app.listen(PORT, async() => {
      console.log(`Listening on port ${PORT}`);
       dbConnection();
  await User.sync({ alter: true }); 
      startExpireCron()
      startReminderCron();
})
