const router = require('express').Router();
const byaheros = require('./ipGetter');

router.use('/ip', byaheros);


module.exports = router;
