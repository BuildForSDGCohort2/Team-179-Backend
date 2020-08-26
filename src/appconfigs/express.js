/**
 * @copyright 2020-present Team-179-Group-A
*/

/* eslint-disable no-param-reassign */
const path = require('path');
const express = require('express');
const HttpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const debug = require('debug')('app:Express');
const config = require('./config')();
const routes = require('../router');
const otherHelper = require('../helpers/otherhelpers');

const app = express();
const isProduction = config.env === 'production';

// serve startic files
const distDir = '../../public';
app.use(express.static(path.join(__dirname, distDir)));
// secure apps by setting various HTTP headers
app.use(helmet());
// protect against HTTP Parameter Pollution attacks
app.use(hpp());
app.use(cors());
app.use(methodOverride());
// Logger middleware when on dev env
if (!isProduction) {
  app.use(logger('dev'));
}
// Body parser middleware

// create application/json parser
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
// create application/x-www-form-urlencoded parser
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  }),
);
// use Cookie middleware
app.use(
  cookieSession({
    name: 'session',
    keys: [config.sessionSecret],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
app.use(cookieParser());
app.use(compress());

// Passport Config
require('./passport')(app);
// Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Agri-Fund API');
});
// API router
app.use('/api', routes);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new HttpError(404);
  return next(error);
});
// error handler, send stacktrace only during development
app.use((error, req, res) => {
  // customize Joi validation errors
  if (error.isJoi) {
    error.message = error.details.map((e) => e.message).join(';');
    error.status = 400;
  }
  const status = error.status ? error.status : 500;
  if (!isProduction) {
    debug(error);
    return otherHelper.sendResponse(res, status, false, null, error, error.message, null);
  }
  return otherHelper.sendResponse(res, status, false, null, error, error.message, null);
});

module.exports = app;
