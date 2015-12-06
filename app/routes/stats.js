var nconf = require('nconf');
var logger = require('winston');
var scorecard = require('../models/scorecard');
var _ = require('underscore');

module.exports = function(router) {
  'use strict';

  // This will handle the url calls for /scorecard/:user_id
  router.route('/:userId/lifetime')
  .get(function(req, res, next) {
    scorecard.aggregate([
        { $match: {
            "user.accountId": req.params.userId
        }},
        { $unwind: "$rounds" },
        { $group: {
            _id: "$_id",
            averageRound: { $avg: "$rounds.score"  },
            highRound: { $max: "$rounds.score"  },
            lowRound: { $min: "$rounds.score"  },
            count: { $sum: 1 }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.send(result);
    });
  });
  router.route('/:userId/last30')
  .get(function(req, res, next) {
    var today = new Date();
    var strLastMonth = "".concat(today.getFullYear(), "-", ((today.getMonth() != 0)? today.getMonth():12),"-", today.getDate());
    var lastMonth = new Date(strLastMonth );

    scorecard.aggregate([
        { $match: { "user.accountId": req.params.userId } },
        { $unwind: "$rounds" },
        { $match: {"rounds.recordedDate": {$gte: lastMonth}}},
        { $group: {
            _id: "$_id",
            averageRound: { $avg: "$rounds.score"  },
            highRound: { $max: "$rounds.score"  },
            lowRound: { $min: "$rounds.score"  },
            count: { $sum: 1 }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.send(result);
    });
  });

}
