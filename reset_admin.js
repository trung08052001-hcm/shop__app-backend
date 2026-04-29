const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopapp')
.then(async () => {
    let user = await User.findOne({ email: 'trung@gmail.com' });
    if (user) {
        user.password = '123456';
        await user.save();
        console.log('Password for trung@gmail.com reset to 123456 successfully!');
    } else {
        // Create user
        user = await User.create({
            name: 'Trung User',
            email: 'trung@gmail.com',
            password: '123456',
            address: 'Hanoi, Vietnam',
            phone: '0123456789'
        });
        console.log('Created user trung@gmail.com with password 123456 successfully!');
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
