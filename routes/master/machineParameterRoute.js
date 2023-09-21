var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const machineParameter = require('../../controllers/machineParameterController')

router.get('/view', auth.verifyToken, machineParameter.readDB)
router.post('/add', auth.verifyToken, machineParameter.insertDB)
router.put('/edit/:id', auth.verifyToken, machineParameter.updateDB)
router.delete('/delete/:id', auth.verifyToken, machineParameter.softDeleteDB)

module.exports = router