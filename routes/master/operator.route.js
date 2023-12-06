var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const operator = require('../../controllers/operator.controller')

router.get('/view', auth.verifyToken, operator.readDb)

module.exports = router