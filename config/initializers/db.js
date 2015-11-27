// config/initializers/db.js
var logger = require('winston');
var nconf = require('nconf');
var MongoClient = require('mongodb').MongoClient;

module.exports = function(cb) {
  'use strict';
  logger.info('[DB] Configuring db to connect to:', nconf.get('database'));
  
  cb();
    
};