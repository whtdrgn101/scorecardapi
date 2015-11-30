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
  router.route('/:userid/bows')
  .get(function(req, res, next) {

    scorecard.findOne({'user.userId': req.params.userId}).select('bows').exec(function (err, bows) {
      if (err) { throw err; }

      res.send(bows);
    });

  }).post(function(req, res, next) {
     
    res.sendStatus(201);
   
  });
  
  // [/scorecard/:userId/bows/:bowNum] - Work with a specific bow
  router.route('/:userId/bows/:bowNum')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId, 'bows.bowNum': req.params.bowNum}).select('bows').exec(function (err, bow) {
        if (err) {
          throw err;
        }
        if(bow) {
          res.send(bow);
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
  
  // [/scorecard/:userId/rounds] - Returns list of rounds for provided users
  router.route('/:userid/rounds')
  .get(function(req, res, next) {

    scorecard.findOne({'user.userId': req.params.userId}).select('rounds').exec(function (err, rounds) {
      if (err) { throw err; }

      res.send(rounds);
    });

  }).post(function(req, res, next) {
     
    res.sendStatus(201);
   
  });
  
  // [/scorecard/:userId/rounds/:roundNum] - Work with a specific round
  router.route('/:userId/bows/:bowNum')
  .get(function(req, res, next) {
    if (req.params.userId) {
      scorecard.findOne({'user.userId': req.params.userId, 'rounds.roundNum': req.params.bowNum}).select('rounds').exec(function (err, round) {
        if (err) {
          throw err;
        }
        if(round) {
          res.send(round);
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
};