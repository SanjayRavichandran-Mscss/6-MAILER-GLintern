const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Routes
router.post('/register', register); // Endpoint: /api/auth/register
router.post('/login', login);       // Endpoint: /api/auth/login

module.exports = router;
