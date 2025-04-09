const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
});

// Create new product
// Trong hàm createProduct
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category } = req.body;
    if (!name || !price || !description || !image || !category) {
        res.status(400);
        throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm");
    }
    
    const product = await Product.create({
        name,
        price,
        description,
        image,
        category
    });
    
    res.status(201).json({
        ...product._doc,
        id: product.productId // Trả về ID dễ đọc
    });
});

// Get product by ID
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm!");
    }
    res.status(200).json(product);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm!");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedProduct);
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Không tìm thấy sản phẩm!");
    }
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json(product);
});

// Thêm hàm searchProducts
const searchProducts = asyncHandler(async (req, res) => {
    const { search, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    // Tìm theo tên sản phẩm
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    
    // Lọc theo danh mục
    if (category) {
        query.category = category;
    }
    
    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query);
    res.status(200).json(products);
});

// Thêm vào exports
module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};