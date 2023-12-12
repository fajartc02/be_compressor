require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
const schedulerAutonomusCheck = require("./helpers/autonomus.functions");
var app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

var cron = require('node-cron');
const calculateParamsUpdate = require("./helpers/calculateParams.functions");

cron.schedule('*/30 * * * * *', async() => {
    console.log('running a task check values actual every 30 seconds');
    schedulerAutonomusCheck()
});

cron.schedule('*/15 * * * * *', async() => {
    console.log('running a task calculate parameters every 15 seconds');
    calculateParamsUpdate([`'FLOW_DC_6'`, `'FLOW_DC_7'`, `'FLOW_DC_8'`, `'FLOW_DC_9'`], 27)
    calculateParamsUpdate([`'FLOW_LP_1'`, `'FLOW_LP_2'`, `'FLOW_LP_3'`, `'FLOW_LP_4'`, `'FLOW_LP_5'`], 34)
});

module.exports = app;