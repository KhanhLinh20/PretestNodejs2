const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    password: String,
    confirmPassword: String,
})

module.exports = mongoose.model('user', userSchema);