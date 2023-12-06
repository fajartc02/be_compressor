var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const formula = require('../../controllers/formula.controller')

router.get('/view', auth.verifyToken, formula.readDb)
router.post('/add', auth.verifyToken, formula.insertDb)

module.exports = router