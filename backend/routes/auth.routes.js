const express = require('express');
const router = express.Router();
const {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { refreshTokenGuard } = require('../middleware/auth.middleware');

router.post('/', login);
router.post('/refresh-token', refreshTokenGuard, refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
