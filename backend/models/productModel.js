const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, 'Please add a name!!'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Please add a category!!'],
        trim: true,
    },
    quantity: {
        type: String,
        required: [true, 'Please add quantity!!'],
        trim: true,
    },
    price: {
        type: String,
        required: [true, 'Please add price!!'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add description!!'],
        trim: true,
    },
    image: {
        type: Object,
        default: {}
    },
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;