const express = require('express')
const app = express();
const db = require('./db');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');

app.use('/user',authRoutes)

app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
})
