const mongoose = require('mongoose');
const productSchema =  mongoose.Schema({
    productID: String,
    productName: String,
    productPrice: Number,
    // email: String,
    // password: String,
    image: String
})

module.exports = mongoose.model('product', productSchema);