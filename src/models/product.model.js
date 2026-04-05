// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true, trim: true },
//         description: { type: String, required: true },
//         price: { type: Number, required: true, min: 0 },
//         image: { type: String, required: true },
//         category: { type: String, required: true },
//         stock: { type: Number, required: true, default: 0 },
//         rating: { type: Number, default: 0 },
//         numReviews: { type: Number, default: 0 },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },

        sold: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true },

        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);