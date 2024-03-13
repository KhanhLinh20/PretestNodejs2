var express = require('express');
const productModel = require('../model/productModel');
var router = express.Router();

const multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    }, 
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    }
});
const upload = multer({storage: store});

/* GET home page. */
router.get('/', async function(req, res, next) {
    let product = await productModel.find();
    res.render('product/index', { products: product });
});

/* GET create page */
router.get('/create', async function(req, res, next) {
    res.render('product/create');
});

/* POST create page */
router.post('/createPost', upload.single('image'), async function(req, res, next) {
    let file = req.file;
    let productP = new productModel({
        productID: req.body.productID,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        email: req.body.email,
        password: req.body.password,
        image: file.filename
    });
    await productP.save();
    res.redirect('/product');
});

module.exports = router;


