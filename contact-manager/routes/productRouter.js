const express = require('express');
const router = express.Router();
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts // Thêm controller mới
} = require('../controllers/productController');

// Thêm route tìm kiếm
router.get("/search", searchProducts);

router.route("/")
    .get(getProducts)
    .post(createProduct);

router.route("/:id")
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;