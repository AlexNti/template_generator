#!/usr/bin/env node

require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./controllers/errors/error');

const app = express();
const testRoutes = require('./routes/test');
const winston = require('./Utils/logger');
// view engine setup

// Cross Origin Resource Sharing
app.use(cors());
// protect api requests
app.use(helmet());
// Preventing HTTP Parameter Pollution
app.use(hpp());

app.use(session({
    name: 'SESS_ID',
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  
  }));

app.use(logger('combined',{ stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', testRoutes);

app.use(errorHandler);


module.exports = app;
