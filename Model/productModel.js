const mongoose = require('mongoose');
const product =  mongoose.Schema({
    productID: String,
    productName: String,
    productPrice: Number,
    email: String,
    password: String,
    image: String
})

module.exports = mongoose.model('product', product);