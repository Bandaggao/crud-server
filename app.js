const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const logger = require('./src/core/logger');
// const db = require('./src/core/database');
const apiRoutes = require('./src/routes');
const { response, ENDPOINT_NOT_FOUND } = require('./src/core/response');

// Set up database connection
// db.connect()
//   .then(data => data)
//   .catch(error => error);

app.use(cors());

// Set up basic security emplementations
app.use(helmet());

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Set up API success/error handler middleware
app.use(function(req, res, next) {
  res.success = function(response) {
    logger.log('info', `[${res.req.method}][${req.originalUrl}]`, response);
    res.status(response.status).json(response.body);
  };

  res.error = function(error) {
    console.log('Error', error);
    logger.log('error', `[${res.req.method}][${req.originalUrl}]`, error);
    res.status(error.status).json(error.body);
  };

  next();
});

// Register all routes available
app.use('/v1', apiRoutes);
app.use('*', apiRoutes, (req, res) => {
  res.error(response(ENDPOINT_NOT_FOUND));
});

module.exports = app;
