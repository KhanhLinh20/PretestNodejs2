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
    res.redirect('/user/login');
});

/* GET login page */
router.get('/login', async function(req, res, next) {
    res.render('user/login');
})

/* POST login page */
router.post('/loginPost', async (req, res) => {
    const { emailInput, passwordInput } = req.body;

    // Tìm kiếm người dùng theo email
    const user = await userModel.findOne({ email: emailInput });
    
    // So sánh mật khẩu đã nhập với mật khẩu đã lưu
    const isMatch = await bcryptjs.compare(passwordInput, user.password);
    if (!user || !isMatch) {
        return res.render(('user/login'), {messageLogIn: 'Email or password is incorrect'});
    }

    // Nếu mọi thứ đều khớp, cho phép đăng nhập
    res.redirect('/');
});
module.exports = router;