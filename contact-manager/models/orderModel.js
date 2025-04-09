const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipientName: {
            type: String,
            required: [true, "Vui lòng nhập tên người nhận!"]
        },
        phoneNumber: {
            type: String,
            required: [true, "Vui lòng nhập số điện thoại!"]
        },
        address: {
            type: String,
            required: [true, "Vui lòng nhập địa chỉ!"]
        },
        paymentMethod: {
            type: String,
            required: [true, "Vui lòng chọn phương thức thanh toán!"],
            enum: ['credit_card', 'cash_on_delivery', 'bank_transfer']
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        },
        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);