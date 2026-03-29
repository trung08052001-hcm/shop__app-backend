const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/notification.model');
dotenv.config();

const data = [
    {
        title: 'Flash Sale cuối tuần 🔥',
        body: 'Giảm đến 50% tất cả điện thoại cao cấp. Chỉ trong 48 giờ!',
        type: 'sale',
        discount: 50,
    },
    {
        title: 'Sản phẩm mới vừa về',
        body: 'iPhone 15 Pro Max và MacBook M3 Pro đã có hàng. Đặt ngay!',
        type: 'new_product',
        discount: null,
    },
    {
        title: 'Ưu đãi thành viên tháng 4',
        body: 'Giảm thêm 10% cho đơn hàng từ 5 triệu. Áp dụng đến 30/4.',
        type: 'promotion',
        discount: 10,
    },
    {
        title: 'Miễn phí vận chuyển toàn quốc',
        body: 'Áp dụng cho tất cả đơn hàng trong tháng này. Không giới hạn!',
        type: 'event',
        discount: null,
    },
    {
        title: 'Ngày hội mua sắm 5/5',
        body: 'Hàng nghìn sản phẩm giảm giá đồng loạt. Đặt nhắc nhở ngay!',
        type: 'event',
        discount: null,
    },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await Notification.deleteMany();
    await Notification.insertMany(data);
    console.log('Seeded notifications');
    process.exit(0);
});