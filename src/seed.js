const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');

dotenv.config();

const products = [
    {
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro 256GB, chip A17 Pro',
        price: 28990000,
        image: 'https://picsum.photos/seed/iphone/400/400',
        category: 'Điện thoại',
        stock: 50,
        rating: 4.8,
        numReviews: 120,
    },
    {
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 256GB, chip Snapdragon 8 Gen 3',
        price: 22990000,
        image: 'https://picsum.photos/seed/samsung/400/400',
        category: 'Điện thoại',
        stock: 30,
        rating: 4.6,
        numReviews: 85,
    },
    {
        name: 'MacBook Air M3',
        description: 'Apple MacBook Air 13 inch, chip M3, RAM 16GB',
        price: 32990000,
        image: 'https://picsum.photos/seed/macbook/400/400',
        category: 'Laptop',
        stock: 20,
        rating: 4.9,
        numReviews: 60,
    },
    {
        name: 'iPad Pro M4',
        description: 'Apple iPad Pro 11 inch, chip M4, WiFi 256GB',
        price: 23990000,
        image: 'https://picsum.photos/seed/ipad/400/400',
        category: 'Máy tính bảng',
        stock: 25,
        rating: 4.7,
        numReviews: 45,
    },
    {
        name: 'AirPods Pro 2',
        description: 'Apple AirPods Pro thế hệ 2, chống ồn ANC',
        price: 6490000,
        image: 'https://picsum.photos/seed/airpods/400/400',
        category: 'Phụ kiện',
        stock: 100,
        rating: 4.5,
        numReviews: 200,
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Tai nghe Sony chống ồn cao cấp, 30h pin',
        price: 8490000,
        image: 'https://picsum.photos/seed/sony/400/400',
        category: 'Phụ kiện',
        stock: 40,
        rating: 4.7,
        numReviews: 95,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        await Product.deleteMany();
        console.log('Cleared old products');

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();