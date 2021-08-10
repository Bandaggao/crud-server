const router = require('express').Router();
const productController = require('../controllers/product-controller');
const { SchemaValidator } = require('../core/validator');
const productSchema = require('../validators/product-schema');



router.get('/:branch_id', 
productController.getAllProducts);

router.post(
  '/',
  SchemaValidator().setSchema(productSchema).scan,
  productController.create
);

router.put(
  '/:id',
  SchemaValidator().setSchema(productSchema).scan,
  productController.updateProductByID
);

// router.delete('/:id', 
// productController.deleteProductByID);

router.get('/:id', 
productController.getProductByID);

router.get('/merchantstocks/:merchant_id', 
productController.getMerchantStocks);

router.get('/productcategory/:merchantId/:categoryId', 
productController.getCategoryByID);

router.get('/product/feature', 
productController.getFeaturedyByID);

router.get('/search/:str', 
productController.getBySearch);

module.exports = router;