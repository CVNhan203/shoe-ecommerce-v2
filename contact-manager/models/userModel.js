const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Vui lòng nhập tên người dùng!"]
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập địa chỉ email!"],
            unique: [true, "Địa chỉ email đã tồn tại!"]
        },
        password: {
            type: String,
            required: [true, "Vui lòng nhập mật khẩu!"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);