// config/initializers/db.js
var logger = require('winston');
var nconf = require('nconf');
var mysql      = require('mysql');

module.exports = function(cb) {
  'use strict';
  logger.info('[DB] Configuring mysqldb:'
    ,' host: ', nconf.get('mysqlHost')
    ,' user: ', nconf.get('mysqlUser')
    ,' database: ', nconf.get('mysqlDatabase')
  );
  var dbconn = mysql.createConnection({
    host     : nconf.get('mysqlHost'),
    user     : nconf.get('mysqlUser'),
    password : nconf.get('mysqlPassword'),
    database : nconf.get('mysqlDatabase')
  });

  dbconn.connect();
  
  cb();
    
};