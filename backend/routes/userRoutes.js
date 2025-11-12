const express = require('express');
const router = express.Router();
const {
  registerUser,
  getAllUsers,
  getUserById,
} = require('../controllers/userController');

// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// POST /api/users - Also support register via POST /api/users
router.post('/', registerUser);
  
// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

module.exports = router;
