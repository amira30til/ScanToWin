const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// POST /api/auth - Login user
router.post('/', loginUser);

module.exports = router;
