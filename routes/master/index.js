var express = require('express');
var router = express.Router();
const user = require('./userRoute')
const company = require('./companyRoute')

router.use('/users', user)
router.use('/companies', company)


module.exports = router