const router = require('express').Router();
const employee = require('./employee');




router.use('/employees', employee);


module.exports = router;
