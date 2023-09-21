var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const parameter = require('../../controllers/parameterController')

router.get('/view', auth.verifyToken, parameter.readDB)
router.post('/add', auth.verifyToken, parameter.insertDB)
router.put('/edit/:id', auth.verifyToken, parameter.updateDB)
router.delete('/delete/:id', auth.verifyToken, parameter.softDeleteDB)

module.exports = router