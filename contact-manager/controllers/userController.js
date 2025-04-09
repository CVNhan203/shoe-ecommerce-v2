const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


// Đăng ký người dùng
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    //Kiểm tra dữ liệu user gởi lên
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Vui lòng nhập đầy đủ dữ liệu");
    }
    //Kiểm tra user đã tồn tại chưa
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("Tài khoản đã tồn tại!");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Tạo tài khoản
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({
            msg: "Tạo tài khoản thành công!",
            _id: user.id,
            email: user.email
        });
    } else{
        res.status(400);
        throw new Error("Thông tin người dùng không hợp lệ!");
    }
    res.json({message: "Đăng ký tài khoản người dùng."});
});


// Đăng nhập
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //Kiểm tra dữ liệu user gởi lên
    if(!email || !password){
        res.status(400);
        throw new Error("Vui lòng nhập đầy đủ dữ liệu!");
    }
    //Tìm user trong database
    const user = await User.findOne({email});
    //So sánh password
    if(user && await bcrypt.compare(password, user.password)){
        //Tạo token gởi về cho user
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "5m"}
        );
        res.status(200).json({accessToken})
    } else{
        res.status(401);
        throw new Error("Email hoặc Password không đúng!");
    }
});

// Hiển thị thông tin người dùng hiện tại
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
};