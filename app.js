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

cron.schedule('*/30 * * * * *', async() => {
    console.log('running a task every 30 seconds');
    schedulerAutonomusCheck()
});

module.exports = app;