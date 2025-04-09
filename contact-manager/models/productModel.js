const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên sản phẩm!"]
        },
        price: {
            type: Number,
            required: [true, "Vui lòng nhập giá sản phẩm!"]
        },
        description: {
            type: String,
            required: [true, "Vui lòng nhập mô tả sản phẩm!"]
        },
        image: {
            type: String,
            required: [true, "Vui lòng nhập URL hình ảnh sản phẩm!"]
        },
        category: {
            type: String,
            required: [true, "Vui lòng chọn danh mục sản phẩm!"]
        },
        stock: {
            type: Number,
            required: [true, "Vui lòng nhập số lượng tồn kho!"],
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);