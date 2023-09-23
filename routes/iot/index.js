var express = require('express');
var router = express.Router();
const compressor = require('./compressor')

router.use('/compressor', compressor)

module.exports = router