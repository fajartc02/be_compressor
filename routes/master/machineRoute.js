var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const machine = require('../../controllers/machineController')

router.get('/view', auth.verifyToken, machine.readDB)
router.post('/add', auth.verifyToken, machine.insertDB)
router.put('/edit/:id', auth.verifyToken, machine.updateDB)
router.delete('/delete/:id', auth.verifyToken, machine.softDeleteDB)

module.exports = router