// config/initializers/server.js

var express = require('express');
var path = require('path');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

var start =  function(cb) {
  'use strict';
  // Configure express 
  app = express();

  app.use(morgan('common'));
  app.use(bodyParser.json({type: '*/*'}));

  logger.info('[SERVER] Initializing routes');
  require('../../app/routes/index')(app);
  
  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://www.myshootinglog.com:9000');
    res.header('Access-Control-Allow-Origin', 'http://www.myshootinglog.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  }

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(allowCrossDomain);
  
  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
   res.json({
      message: err.message,
      error: (app.get('env') === 'dev' ? err : {})
    });
    next(err);
  });

  app.listen(config.get('NODE_PORT'));
  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));
  
  if (cb) {
    return cb();
  }
};

module.exports = start;