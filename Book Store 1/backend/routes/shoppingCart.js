const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingCartController');
const verifyToken = require('../middleware/verify');

// Routes (without authentication middleware for now)
router.post('/add-to-cart', shoppingCartController.addToCart);
router.get('/get-cart', verifyToken, shoppingCartController.getCart);
router.put('/update-cart', verifyToken, shoppingCartController.updateCart);
router.delete('/clear-cart', verifyToken, shoppingCartController.clearCart);

module.exports = router;
