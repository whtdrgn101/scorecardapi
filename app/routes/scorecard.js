// app/routes/scorecard.js
var nconf = require('nconf');
var logger = require('winston');
var scorecard = require('../models/scorecard');

module.exports = function(router) {
  'use strict';
  
  // This will handle the url calls for /scorecard/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId}, function (err, card) {
        if (err) {
          throw err;
        }
        if(card) {
          res.send(card);
        } else {
          res.sendStatus(404);
        }

      });
    } else {
      res.sendStatus(404);
    }
  }) 
  .put(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId}, function (err, card) {
        if (err) {
          throw err;
        }

        if(card) {

          console.log(req.body);
          card.save();
          res.sendStatus(202);
        } else {
          res.sendStatus(404);
        }

      });
    } else {
      res.sendStatus(404);
    }
  })
  .patch(function(req, res,next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId}, function (err, scorecards) {
        if (err) {
          throw err;
        }
        //TODO: Replace record
      });
    } else {
      res.sendStatus(404);
    }
  })
  .delete(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId}).remove(function (err, scorecards) {
        if (err) {
          throw err;
        }
        res.sendStatus(202);
      });
    } else {
      res.sendStatus(404);
    }
  });

  router.route('/')
  .get(function(req, res, next) {

    scorecard.find({}, function(err, scorecards) {
      if (err) { throw err; }

      res.send(scorecards);
    });

  }).post(function(req, res, next) {
     
    var card = new scorecard({user:{email:"whtdrgn101@gmail.com"}});
    card.save(function(err, cd){
      res.json(cd);
    });
   
  });
};