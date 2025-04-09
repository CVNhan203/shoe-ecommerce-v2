const express = require('express');
const app = express();
const cors = require('cors');
const contactRouter = require('./routes/contactRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter'); // Thêm orderRouter
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const dbConnect = require('./config/dbConnect')

//Connect Database
dbConnect();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:8080', // Vue.js development server //"*" chấp nhận tất cả origin
    credentials: true
}));

//Build-in Middleware
app.use(express.json());

//get
app.get('/', (req, res) => {
    res.send('Contact Manager Project');
});
//Routes
app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

//Error Handle Middleware
app.use(errorHandler);

//Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});