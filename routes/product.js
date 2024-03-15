var express = require('express');
const productModel = require('../Model/productModel');
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

/* GET delete page */
router.get('/delete/:id', async function(req, res, next) {
    await productModel.deleteOne({productID: req.params.id});
    res.redirect('/product');
});

/* GET update page */
router.get('/update/:id', async function(req, res, next) {
    let updateProduct = await productModel.findOne({productID: req.params.id});
    res.render('product/update', {updateProduct});
});

/* POST update page */
router.post('/updatePost/:id', upload.single('image'), async function(req, res, next) {
    let file = req.file;
    const body = req.body;
    if (!file) {   
        // Loại bỏ trường _id từ req.body
        // delete req.body._id; 
        // Sử dụng phương thức findOneAndUpdate để cập nhật tài liệu
        await productModel.findOneAndUpdate({productID: req.params.id}, {$set: req.body});
        res.redirect('/product');
    }
    else {
        let updateData = {
            productID: body.productID,
            productName: body.productName,
            productPrice: body.productPrice,
            email: body.email,
            password: body.password,
            image: file.filename
        };
        // Loại bỏ trường _id từ đối tượng updateData
        // delete updateData._id;
        // Sử dụng phương thức findOneAndUpdate để cập nhật tài liệu
        await productModel.findOneAndUpdate({productID: req.params.id}, {$set: updateData});
        res.redirect('/product');
    }
});


module.exports = router;


