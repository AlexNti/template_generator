#!/usr/bin/env node

require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('./controllers/errors/error');

const app = express();
const testRoutes = require('./routes/test');
const winston = require('./Utils/logger');
// view engine setup

app.use(logger('combined',{ stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', testRoutes);

app.use(errorHandler);


module.exports = app;
