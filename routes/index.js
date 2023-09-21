var express = require('express');
var router = express.Router();
const auth = require('./auth/index')
const master = require('./master/index')

router.use('/', auth)
router.use('/master', master)

module.exports = router;