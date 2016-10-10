var nconf = require('nconf');
var logger = require('winston');
var member = require('../shared/member');

module.exports = function(router) {
    'use strict';

    // This will handle the url calls for /scorecard/:user_id
    router.route('/:userId/lifetime')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)) {
                member.getLifetimeStats(req.params.userId).then(results => {
                    res.status(200).send(results);
                }).catch(error => {
                   res.status(400).send(error); 
                });
            }
        });
    router.route('/:userId/last30')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)) {
                member.getLast30DayStats(req.params.userId).then(results => {
                    res.status(200).send(results);
                }).catch(error => {
                   res.status(400).send(error); 
                });
            }
        });
    router.route('/:userId/last')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)) {
                member.getLastRoundStats(req.params.userId).then(results => {
                    res.status(200).send(results);
                }).catch(error => {
                   res.status(400).send(error); 
                });
            }
        });

}
