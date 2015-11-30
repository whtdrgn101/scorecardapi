// app/routes/scorecard.js
var nconf = require('nconf');
var logger = require('winston');
var scorecard = require('../models/scorecard');
var _ = require('underscore');

module.exports = function(router) {
  'use strict';
  
  // This will handle the url calls for /scorecard/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user._id': req.params.userId}, function (err, card) {
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
      scorecard.findOne({'user._id': req.params.userId}, function (err, card) {
        if (err) {
          throw err;
        }

        if(card) {
          card.update(req.body, function(err, c){
            if (err) {
              throw err;
            }
            card.save();
            res.sendStatus(202);
          });
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
      scorecard.findOne({'user._id': req.params.userId}, function (err, scorecards) {
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
      try {
        scorecard.findOne({'user._id': req.params.userId}).remove(function (err, card) {
          
          if(!err && card.result.n >= 1)
            res.sendStatus(202);
          else
            res.sendStatus(404);
        });
      } catch(err) {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  });

  // [/scorecard] route, returns list of all scorecards for an admin app and allows POST to create new
  router.route('/')
  .get(function(req, res, next) {

    scorecard.find({}, function(err, scorecards) {
      if (err) { throw err; }

      res.send(scorecards);
    });

  }).post(function(req, res, next) {
     
    res.sendStatus(201);
   
  });
  
  // [/scorecard/:userId/bows] - Returns list of bows for provided users
  router.route('/:userId/bows')
  .get(function(req, res, next) {
    
    scorecard.findOne({'user._id': req.params.userId}).select('bows').exec(function (err, bows) {
      if (err) { 
        res.sendStatus(404) 
      } else {
        res.send(bows.bows);  
      }
      
    });

  }).post(function(req, res, next) {
     
    scorecard.findOne({'user._id': req.params.userId}).exec(function (err, results) {
      if (results) { 
        results.bows.push(req.body);
        results.save();
        res.sendStatus(201);
      } else {
        res.sendStatus(404);
      }
      
    });
   
  });
  
  // [/scorecard/:userId/bows/:bowNum] - Work with a specific bow
  router.route('/:userId/bows/:bowId')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user._id': req.params.userId, 'bows._id': req.params.bowId}).select('bows').exec(function (err, bow) {
        if(bow) {
          var found = _.find(bow.bows, function(f) {return f._id == req.params.bowId});
          res.send(found);
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
      scorecard.findOne({'user._id': req.params.userId}, function (err, results) {
        if(results) {
          if (err) {
            throw err;
          }
          
          var found = results.bows.id(req.params.bowId);
          found.name = req.body.name;
          found.make = req.body.make;
          found.model = req.body.model;
          found.type = req.body.type;
          found.poundage = req.body.poundage;
          found.braceHeight = req.body.braceHeight;
          found.amoLength = req.body.amoLength;
          
          results.save();
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
   res.sendStatus(405);
  })
  .delete(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user._id': req.params.userId, 'bows._id': req.params.bowId}).exec(function (err, results) {
        if (results) {
          var bow = results.bows.id(req.params.bowId).remove();
          results.save();
          res.sendStatus(202);  
        } else {
          res.sendStatus(404);
        }
        
      });
    } else {
      res.sendStatus(404);
    }
  });
  
  // [/scorecard/:userId/rounds] - Returns list of rounds for provided users
  router.route('/:userId/rounds')
  .get(function(req, res, next) {

    scorecard.findOne({'user._id': req.params.userId}).select('rounds').exec(function (err, rounds) {
      if (err) { 
        res.sendStatus(404) 
      } else {
        res.send(rounds.rounds);  
      }
    });

  }).post(function(req, res, next) {
     
    scorecard.findOne({'user._id': req.params.userId}).exec(function (err, results) {
      if (results) { 
        results.rounds.push(req.body);
        results.save();
        res.sendStatus(201);
      } else {
        res.sendStatus(404);
      }
      
    });
   
  });
  
  // [/scorecard/:userId/rounds/:roundNum] - Work with a specific round
  router.route('/:userId/rounds/:roundId')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user._id': req.params.userId, 'rounds._id': req.params.roundId}).select('rounds').exec(function (err, round) {
        
        if(round) {
          var found = _.find(round.rounds, function(f) {return f._id == req.params.roundId});
          res.send(found);
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
      scorecard.findOne({'user._id': req.params.userId}, function (err, results) {
        if(results) {
          if (err) {
            throw err;
          }
          
          var found = results.rounds.id(req.params.roundId);
          found.recordedDate = req.body.recordedDate;
          found.bowName = req.body.bowName;
          found.score = req.body.score;
          found.notes = req.body.notes;
          found.location = req.body.locations;
          found.ends = req.body.ends;
          
          results.save();
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
    res.sendStatus(405);
  })
  .delete(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user._id': req.params.userId}).exec(function (err, results) {
         if (results) {
          var round = results.rounds.id(req.params.roundId).remove();
          results.save();
          res.sendStatus(202);  
        } else {
          res.sendStatus(404);
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
};