const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await mongoose.connection.collection('orders').deleteMany({});
    console.log('Đã xoá hết orders');
    process.exit(0);
});