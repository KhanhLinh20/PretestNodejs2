var express = require('express');
const productModel = require('../Model/productModel');
var router = express.Router();

const bcryptjs = require('bcryptjs');
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
    // Hash password
    // const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    let productP = new productModel({
        productID: req.body.productID,
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        email: req.body.email,
        password: req.body.password,
        // password: hashedPassword,
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

/* GET search by name page */
router.get('/search', async (req, res) => {
    const searchByName = req.query.productName; // Lấy tên sản phẩm từ query parameter

    // Tìm kiếm tên sản phẩm trong cơ sở dữ liệu
    const productSearch = await productModel.find({productName: {$regex: new RegExp(searchByName, "i")}});
    if (productSearch.length === 0) {
        // Không tìm thấy sản phẩm phù hợp
        res.render('product/index', { messageSearch: "Search Not Found" });
    } else {
        // Tìm thấy sản phẩm, trả về kết quả
        res.render('product/index', {products: productSearch});
    }
});

/* GET search by price */
router.get('/searchPrice', async(req, res) => {
    // Lấy giá trị tối thiểu và tối đa từ query parameters
    const searchMinPrice = parseFloat(req.query.minPrice) || 0;
    const searchMaxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    // Đảm bảo maxPrice luôn lớn hơn hoặc bằng minPrice
    // if (searchMaxPrice < searchMinPrice) {
    //     searchMaxPrice = searchMinPrice;
    // }

    // Tìm kiếm sản phẩm trong khoảng giá
    const productsSeacrchPrice = await productModel.find({ productPrice: { $gte: searchMinPrice, $lte: searchMaxPrice } });
    if (!productsSeacrchPrice || productsSeacrchPrice.length === 0) {
        // Không tìm thấy sản phẩm phù hợp
        res.render('product/index', { messageSearch: "Search Not Found" });
    } else {
        // Tìm thấy sản phẩm, trả về kết quả
        res.render('product/index', {products: productsSeacrchPrice});
    }
})

/* GET register page */
/*router.get('/user/register', function(req, res) {
    res.render('user/register');
})
*/
module.exports = router;


