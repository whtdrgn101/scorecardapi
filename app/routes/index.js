var logger = require('winston');
var changeCase = require('change-case');
var express = require('express');
var routes = require('require-dir')();

module.exports = function(app) {
  'use strict';
  
  // Initialize all routes
  Object.keys(routes).forEach(function(routeName) {
    var router = express.Router();
    // You can add some middleware here 
    // router.use(someMiddleware);
    
    // Initialize the route to add its functionality to router
    require('./' + routeName)(router);
    
    //Setup for CORS
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Authorization, Content-Type, Accept");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      next();
    });
  
    // Add router to the speficied route name in the app
    app.use('/' + changeCase.paramCase(routeName), router);
  }); 
};