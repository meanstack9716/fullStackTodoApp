const express = require('express')
const app = express();
const db = require('./db');
const cors = require("cors");

require('dotenv').config();
const PORT = process.env.PORT || 5000;
app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');

app.use('/user',authRoutes)

app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
})
