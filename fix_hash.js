const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopapp')
.then(async () => {
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    // update admin@shop.com
    await User.updateOne({ email: 'admin@shop.com' }, { password: hashedPassword });
    console.log('Password for admin@shop.com updated to 123456');

    // update trung@gmail.com
    await User.updateOne({ email: 'trung@gmail.com' }, { password: hashedPassword });
    console.log('Password for trung@gmail.com updated to 123456');

    process.exit(0);
});
