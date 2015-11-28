// app/routes/scorecard.js
var nconf = require('nconf');
var logger = require('winston');
var scorecard = require('../models/scorecard');
var mongoose = require('mongoose');

module.exports = function(router) {
  'use strict';
  
  // This will handle the url calls for /scorecard/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {
    
    //Get the specific scorecard
    // MongoClient.connect(nconf.get('database'), function(err, db) {
    //   db.collection(nconf.get('collection')).find().toArray(function(err, result) {
    //     if (err) {
    //       throw err;
    //     }
    //     res.json(result);
    //   });
    // });
  }) 
  .put(function(req, res, next) {
    // Update scorecard
  })
  .patch(function(req, res,next) {
    // Patch
  })
  .delete(function(req, res, next) {
    // Delete record
  });

  router.route('/')
  .get(function(req, res, next) {
    
    scorecard.find(function(err, scorecards) {
      if (err) {
        res.json({message: err});
      } else {
        res.json(scorecards);  
      }
    });
    
  }).post(function(req, res, next) {
     
    var card = new scorecard({user:{email:"whtdrgn101@gmail.com"}});
    card.save(function(err, cd){
      res.json(cd);
    });
   
  });
};