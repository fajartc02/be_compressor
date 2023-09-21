var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const plant = require('../../controllers/plantController')
const uploads = require('../../helpers/upload')

router.get('/view', auth.verifyToken, plant.readDB)
router.post('/add', auth.verifyToken, uploads.single('background'), plant.insertDB)
router.put('/edit/:id', auth.verifyToken, uploads.single('background'), plant.updateDB)
router.delete('/delete/:id', auth.verifyToken, plant.softDeleteDB)

module.exports = router