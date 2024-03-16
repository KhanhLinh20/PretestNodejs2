var express = require('express');
const userModel = require('../Model/userModel');
var router = express.Router();

const bcryptjs = require('bcryptjs');

/* GET register page */
router.get('/register', async function(req, res) {
    res.render('user/register');
})

/* POST register page */
router.post('/registerPost', async function(req, res, next) {
    // Hash password
    const hashedPassword = await bcryptjs.hash(req.body.passwordInput, 10);
    const hashedConfirmPassword = await bcryptjs.hash(req.body.confirmPasswordInput, 10);

    let userU = new userModel({
        name: req.body.nameInput,
        phone: req.body.phoneNumber,
        email: req.body.emailInput,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
    });
    await userU.save();
    res.redirect('/product');
});
module.exports = router;