var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const line = require('../../controllers/lineController')


router.get('/view', auth.verifyToken, line.readDB)
router.post('/add', auth.verifyToken, line.insertDB)
router.put('/edit/:id', auth.verifyToken, line.updateDB)
router.delete('/delete/:id', auth.verifyToken, line.softDeleteDB)

module.exports = router