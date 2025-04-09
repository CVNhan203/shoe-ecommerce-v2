const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    //Xác thực token
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]; //Tách lấy phần mã Token
        //Tiến hành xác thực người dùng
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if(err){
                res.status(401);
                throw new Error("User không có quyền truy cập");   
        }
        req.user = decode.user;
        next();
    })
}

if(!token){
    res.status(401);
    throw new Error("User không có quyền truy cập hoặc không có Token!");
}
})

module.exports = validateToken;