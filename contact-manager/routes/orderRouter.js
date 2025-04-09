const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const validateToken = require('../middleware/validateTokenHandler');

// Áp dụng middleware xác thực cho tất cả routes
router.use(validateToken);

// Routes cho đơn hàng
router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder)
    .put(updateOrderStatus);

router.route('/:id/cancel')
    .put(cancelOrder);

module.exports = router;