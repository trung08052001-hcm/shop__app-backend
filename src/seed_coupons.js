const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/coupon.model');

dotenv.config();

const coupons = [
    {
        code: 'WELCOME10',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 100000,
        maxDiscount: 50000,
        usageLimit: 100,
        expiresAt: new Date('2026-12-31'),
    },
    {
        code: 'SALE50K',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderValue: 200000,
        usageLimit: 50,
        expiresAt: new Date('2026-12-31'),
    },
    {
        code: 'VIP20',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 500000,
        maxDiscount: 200000,
        usageLimit: 30,
        expiresAt: new Date('2026-12-31'),
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        await Coupon.deleteMany();
        await Coupon.insertMany(coupons);
        console.log('Seeded', coupons.length, 'coupons');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();