require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
const schedulerAutonomusCheck = require("./helpers/autonomus.functions");
var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

var cron = require('node-cron');
const cmdMultipleQuery = require("./config/database");
const calculateParamsUpdate = require("./helpers/calculateParams.functions");
// const cmdMultipleQuery = require("./config/database");

cron.schedule('*/40 * * * * *', async() => {
    console.log('running a task check values actual every 40 seconds');
    schedulerAutonomusCheck()
});

cron.schedule('*/10 * * * * *', async() => {
    console.log('running a task calculate parameters every 15 seconds');
    // not use cause by parameter already absorb in 1 address
    await calculateParamsUpdate([`'FLOW_DC_6'`, `'FLOW_DC_7'`, `'FLOW_DC_8'`, `'FLOW_DC_9'`], 27)
    // calculateParamsUpdate([`'FLOW_LP_1'`, `'FLOW_LP_2'`, `'FLOW_LP_3'`, `'FLOW_LP_4'`, `'FLOW_LP_5'`], 34)
    // calculateParamsUpdate([`'FLOW_LP1'`, `'FLOW_LP2'`, `'FLOW_LP3'`, `'FLOW_LP4'`, `'FLOW_LP5'`], 34)
});

cron.schedule('*/10 * * * * *', async() => {
    const checkTotalLengthTransmit = await cmdMultipleQuery(`SELECT COUNT(1) as totalTransmit FROM t_transmit`)
    console.log(checkTotalLengthTransmit, 'Total Transmit')
    // [ { totalTransmit: 0 } ] Total Transmit
    if(checkTotalLengthTransmit[0]?.totalTransmit > 5) {
        await cmdMultipleQuery(`delete from t_transmit`)
    }
})

module.exports = app;