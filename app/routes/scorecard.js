// app/routes/scorecard.js
var nconf = require('nconf');
var MongoClient = require('mongodb').MongoClient;
var logger = require('winston');

module.exports = function(router) {
  'use strict';
  // This will handle the url calls for /scorecard/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {
    // Return user
  }) 
  .put(function(req, res, next) {
    // Update user
  })
  .patch(function(req, res,next) {
    // Patch
  })
  .delete(function(req, res, next) {
    // Delete record
  });

  router.route('/')
  .get(function(req, res, next) {
    
    MongoClient.connect(nconf.get('database'), function(err, db) {
      db.collection(nconf.get('collection')).find().toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.json(result);
      });
    });
  }).post(function(req, res, next) {
    // Create new userdac47e8d-bd87-4e8f-906b-7150a26ae5f9
  });
};