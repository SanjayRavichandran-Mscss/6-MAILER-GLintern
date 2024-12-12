const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Start Server
db.query("SELECT 1")
  .then(() => {
      console.log("MySQL connected!");
      app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("Database connection failed:", err.message));
