var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const { iotOnCompressor, iotOffCompressor } = require('../../controllers/iot.controller')

router.post('/off/:machine_id', auth.verifyToken, iotOffCompressor)

router.post('/on/:machine_id', auth.verifyToken, iotOnCompressor)

module.exports = router