const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/error.middleware');

const authRoute = require('./modules/auth/auth.route');
const productRoute = require('./modules/product/product.route');
const orderRoute = require('./modules/order/order.route');

const app = express();
const notificationRoute = require('./models/notification/notification.route');

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('INCOMING:', req.method, req.url);
    next();
});
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.use(errorMiddleware);
app.use('/api/notifications', notificationRoute);
module.exports = app;
