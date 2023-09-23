var express = require('express');
var router = express.Router();
const auth = require('./auth/index')
const master = require('./master/index')
const iot = require('./iot/index')

router.use('/', auth)
router.use('/master', master)
router.use('/iot', iot)

module.exports = router;