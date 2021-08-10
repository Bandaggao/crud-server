const router = require('express').Router();
const userController = require('../controllers/user-controller');
const mw = require('./middlewares/auth');
const { SchemaValidator } = require('../core/validator');
const userSchema = require('../validators/user-schema');

router.post(
  '/',
  //SchemaValidator().setSchema(userSchema).scan,

  // Needs Admin Authentication for User Creation?
  //  mw.needsAdminAuthentication,  
  
  userController.create
);

router.post(
  '/admin',
  SchemaValidator().setSchema(userSchema).scan,

  // Needs Admin Authentication for User Creation?
  //  mw.needsAdminAuthentication,  
  
  userController.createAdmin
);

router.post('/super-user', userController.createSuperUser)

router.get('/retailer/me', mw.needsAuth,userController.getRetailerInfoById)
router.get('/admin/me',mw.needsAdminAuthentication, userController.getDistributorInfoById)
router.post('/admin/add-td-code',mw.needsAdminAuthentication, userController.addDstributorCode)
router.get('/all/users', mw.needsAuth,userController.getAllUsers)
router.post('/count', mw.needsAuth,userController.countUsersByDateRange)
router.post('/sum/delivered/orders', mw.needsAuth,userController.sumUpAllDeliveredOrdersByDateRange)

router.post('/sendOTP', userController.getOtp)
router.post('/verifyOTP', userController.verifyOTP)
router.post('/updatePassword', userController.updatePassword)
module.exports = router;