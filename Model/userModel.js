const mongoose = require('mongoose');
const user =  mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    password: String,
    confirmPassword: String,
})

module.exports = mongoose.model('dbuser', user);