const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Lấy giỏ hàng của người dùng
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        // Tạo giỏ hàng mới nếu chưa có
        cart = await Cart.create({
            userId,
            items: [],
            totalAmount: 0
        });
    }
    
    res.status(200).json(cart);
});

// Thêm sản phẩm vào giỏ hàng
// Trong hàm addToCart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Sản phẩm không tồn tại");
    }
    
    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
        res.status(400);
        throw new Error("Sản phẩm đã hết hàng hoặc không đủ số lượng");
    }
    
    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        // Tạo giỏ hàng mới nếu chưa có
        cart = await Cart.create({
            userId,
            items: [],
            totalAmount: 0
        });
    }
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, kiểm tra tổng số lượng
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
            res.status(400);
            throw new Error("Số lượng vượt quá hàng tồn kho");
        }
        cart.items[itemIndex].quantity = newQuantity;
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.items.push({
            productId,
            quantity,
            price: product.price,
            name: product.name,
            image: product.image
        });
    }
    
    // Tính lại tổng tiền
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    await cart.save();
    
    res.status(200).json(cart);
});

// Tương tự cập nhật cho hàm updateCartItem
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Sản phẩm không tồn tại");
    }
    
    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
        res.status(400);
        throw new Error("Số lượng vượt quá hàng tồn kho");
    }
    
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
        res.status(404);
        throw new Error("Không tìm thấy giỏ hàng");
    }
    
    // Cập nhật số lượng sản phẩm
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
    } else {
        res.status(404);
        throw new Error("Sản phẩm không có trong giỏ hàng");
    }
    
    // Tính lại tổng tiền
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    await cart.save();
    
    res.status(200).json(cart);
});

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        res.status(404);
        throw new Error("Giỏ hàng không tồn tại");
    }
    
    // Lọc bỏ sản phẩm cần xóa
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    // Tính lại tổng tiền
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    // Lưu giỏ hàng
    await cart.save();
    
    res.status(200).json(cart);
});

// Xóa toàn bộ giỏ hàng
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        res.status(404);
        throw new Error("Giỏ hàng không tồn tại");
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    
    await cart.save();
    
    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};