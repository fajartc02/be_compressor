var express = require('express');
var router = express.Router();
const auth = require('../../helpers/auth')
const user = require('../../controllers/userController')

router.post('/add', auth.verifyToken, user.insertDB)

module.exports = router