var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const conjunction = require('../../controllers/conjunction.controller')

router.get('/view', auth.verifyToken, conjunction.readDb)

module.exports = router