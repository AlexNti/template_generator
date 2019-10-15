#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./controllers/errors/error');

const app = express();
const testRoutes = require('./routes/test');
const swaggerRoutes = require('./routes/swagger');
const winston = require('./Utils/logger');
const graphQlServer = require('./apolloServer');
const { connectDb } = require('./models');


// view engine setup

// Cross Origin Resource Sharing
app.use(cors());
// protect api requests
app.use(helmet());
// Preventing HTTP Parameter Pollution
app.use(hpp());
app.use(logger('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
graphQlServer.applyMiddleware({ app });
connectDb().then(async () => {
  console.log('Connected to mongo db');
}).catch((err) => { console.log(err); });

app.use('/', testRoutes);
app.use('/', swaggerRoutes);

app.use(errorHandler);


module.exports = app;
