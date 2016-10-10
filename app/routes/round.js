// app/routes/bow.js
var nconf = require('nconf');
var logger = require('winston');
var _ = require('underscore');
var security = require('../shared/security');
var round = require('../shared/round');

module.exports = function(router) {
    
    'use strict';
      
    // This will handle the url calls for /bow/:bow_id
    router.route('/:roundId')
        .get(function(req, res, next) {
            if(security.round.hasAccess(req.token, req.params.roundId)) {
                round.getRound(req.params.roundId).then(r => {
                    res.status(200).send(r);
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        })
        .put(function(req, res, next) {
            if(security.round.hasAccess(req.token, req.params.roundId)) {
                var r = req.body;
                r.id = req.params.roundId;
                round.updateRound(r).then(r => {
                    res.status(200).send(r);
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        
        })
        .delete(function(req, res, next) {
            if(security.round.hasAccess(req.token, req.params.roundId)) {
                round.deleteRound(req.params.roundId).then(r => {
                    res.status(200).send({success:true});
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        });

    // [/bow] route
    router.route('/')
        .post(function(req, res, next) {
            var r = req.body;
            
            round.createRound(r).then(b => {
                res.status(201).send(b);
            }).catch(error => {
                res.status(400).send(error);
            });        
        
        });
};