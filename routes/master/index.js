var express = require('express');
var router = express.Router();
const user = require('./userRoute')
const company = require('./companyRoute')
const plant = require('./plantRoute')
const line = require('./lineRoute')
const machine = require('./machineRoute')
const parameter = require('./parameterRoute')
const machineParam = require('./machineParameterRoute')

router.use('/users', user)
router.use('/companies', company)
router.use('/plants', plant)
router.use('/lines', line)
router.use('/machine/parameter', machineParam)
router.use('/machines', machine)
router.use('/parameters', parameter)


module.exports = router