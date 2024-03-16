var express = require('express');
const userModel = require('../Model/userModel');
var router = express.Router();

/* GET register page */
router.get('/register', async function(req, res) {
    res.render('user/register');
})
module.exports = router;