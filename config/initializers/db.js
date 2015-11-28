// config/initializers/db.js
var logger = require('winston');
var nconf = require('nconf');
var mongoose = require("mongoose");

module.exports = function(cb) {
  'use strict';
  logger.info('[DB] Configuring db to connect to:', nconf.get('database'));
  logger.info('[DB] Configuring db to use collection:', nconf.get('collection'));
  mongoose.connect( nconf.get('database'));
  cb();
    
};