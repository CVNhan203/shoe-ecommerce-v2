const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const validateToken = require('../middleware/validateTokenHandler');

// Áp dụng middleware xác thực cho tất cả routes
router.use(validateToken);

router.route('/')
    .get(getCart)
    .post(addToCart)
    .put(updateCartItem)
    .delete(clearCart);

router.route('/:productId')
    .delete(removeFromCart);

module.exports = router;