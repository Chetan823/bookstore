// routes/user.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const verifyToken = require('../middleware/verify'); // Import the middleware


// Registration and login routes remain public
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);

// Protected routes requiring authentication
router.get('/profile', verifyToken, usersController.getUserProfile);
router.put('/profile', verifyToken, usersController.updateUserProfile);
router.delete('/:id', verifyToken, usersController.deleteUser);

module.exports = router;
