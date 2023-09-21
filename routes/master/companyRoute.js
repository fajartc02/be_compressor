var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const company = require('../../controllers/companyController')

router.get('/view', auth.verifyToken, company.readDB)
router.post('/add', auth.verifyToken, company.insertDB)
router.put('/edit/:id', auth.verifyToken, company.updateDB)
router.delete('/delete/:id', auth.verifyToken, company.softDeleteDB)

module.exports = router