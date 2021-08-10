const router = require('express').Router();
const byaherosController = require('../controllers/getIP');


router.get('/getInfo',byaherosController.quotation);
router.get('/test',byaherosController.test);



module.exports = router;
