var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const user = require('../../controllers/userController')

router.post('/add', auth.verifyToken, user.insertDB)
router.get('/view', auth.verifyToken, auth.isAdmin, user.readDB)
router.put('/edit/:id', auth.verifyToken, auth.isAdmin, user.updateDB)
router.delete('/delete/:id', auth.verifyToken, auth.isAdmin, user.softDeleteDB)

module.exports = router