var express = require('express');
const productModel = require('../Model/productModel');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', async function(req, res, next) {
  let product = await productModel.find();
  res.render('product/index', { products: product });
});

module.exports = router;
