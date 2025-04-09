const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên liên hệ!"],
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập địa chỉ Email!"],
        },
        phone: {
            type: String,
            required: [true, "Vui lòng nhập số điện thoại!"],
        },
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Contact', contactSchema);