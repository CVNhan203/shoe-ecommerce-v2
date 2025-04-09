const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Lấy tất cả đơn hàng của người dùng
const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    
    res.status(200).json(orders);
});

// Lấy chi tiết một đơn hàng
const getOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
        res.status(404);
        throw new Error("Không tìm thấy đơn hàng!");
    }
    
    res.status(200).json(order);
});

// Tạo đơn hàng mới
const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { recipientName, phoneNumber, address, paymentMethod, items, totalAmount, orderDate } = req.body;
    
    // Kiểm tra thông tin đơn hàng
    if (!recipientName || !phoneNumber || !address || !paymentMethod || !items || !totalAmount) {
        res.status(400);
        throw new Error("Vui lòng cung cấp đầy đủ thông tin đơn hàng!");
    }
    
    // Kiểm tra danh sách sản phẩm
    if (items.length === 0) {
        res.status(400);
        throw new Error("Đơn hàng phải có ít nhất một sản phẩm!");
    }
    
    // Kiểm tra số lượng tồn kho của từng sản phẩm
    for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
            res.status(404);
            throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại!`);
        }
        
        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho!`);
        }
        
        // Cập nhật số lượng tồn kho
        product.stock -= item.quantity;
        await product.save();
    }
    
    // Tạo đơn hàng mới
    const newOrder = await Order.create({
        userId,
        recipientName,
        phoneNumber,
        address,
        paymentMethod,
        items,
        totalAmount,
        orderDate: orderDate || new Date(),
        status: 'pending'
    });
    
    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.findOneAndUpdate(
        { userId },
        { items: [], totalAmount: 0 }
    );
    
    res.status(201).json(newOrder);
});

// Cập nhật trạng thái đơn hàng (chỉ dành cho admin trong tương lai)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
        res.status(400);
        throw new Error("Vui lòng cung cấp trạng thái đơn hàng!");
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
        res.status(404);
        throw new Error("Không tìm thấy đơn hàng!");
    }
    
    // Cập nhật trạng thái đơn hàng
    order.status = status;
    await order.save();
    
    res.status(200).json(order);
});

// Hủy đơn hàng
const cancelOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
        res.status(404);
        throw new Error("Không tìm thấy đơn hàng!");
    }
    
    // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc processing
    if (order.status !== 'pending' && order.status !== 'processing') {
        res.status(400);
        throw new Error("Không thể hủy đơn hàng ở trạng thái này!");
    }
    
    // Cập nhật trạng thái đơn hàng thành cancelled
    order.status = 'cancelled';
    await order.save();
    
    // Hoàn lại số lượng tồn kho
    for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }
    
    res.status(200).json(order);
});

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder
};