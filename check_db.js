const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopapp')
.then(async () => {
    const users = await User.find({}, 'email password role');
    console.log('All Users:', users);
    
    const user = await User.findOne({email: 'trung@gmail.com'});
    if(user) {
        console.log('Compare 123456:', await user.comparePassword('123456'));
    } else {
        console.log('User trung@gmail.com not found!');
    }
    process.exit(0);
});
