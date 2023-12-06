var express = require('express');
var router = express.Router();
const user = require('./userRoute')
const company = require('./companyRoute')
const plant = require('./plantRoute')
const line = require('./lineRoute')
const machine = require('./machineRoute')
const parameter = require('./parameterRoute')
const operators = require('./operator.route')
const formulas = require('./formula.route')
const conjunction = require('./conjunction.route')
const machineParam = require('./machineParameterRoute')

router.use('/users', user)
router.use('/companies', company)
router.use('/plants', plant)
router.use('/lines', line)
router.use('/machine/parameter', machineParam)
router.use('/machines', machine)
router.use('/parameters', parameter)
router.use('/operators', operators)
router.use('/formulas', formulas)
router.use('/conjunctions', conjunction)


module.exports = router