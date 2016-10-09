// app/routes/bow.js
var nconf = require('nconf');
var logger = require('winston');
var _ = require('underscore');
var security = require('../shared/security');
var bow = require('../shared/bow');

module.exports = function(router) {
    
    'use strict';
      
    // This will handle the url calls for /bow/:bow_id
    router.route('/:bowId')
        .get(function(req, res, next) {
            if(security.bow.hasAccess(req.token)) {
                bow.getBow(req.params.bowId).then(b => {
                    res.status(200).send(b);
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        })
        .put(function(req, res, next) {
            if(security.bow.hasAccess(req.token)) {
                var b = req.body;
                b.id = req.params.bowId;
                bow.updateBow(b).then(b => {
                    res.status(200).send(b);
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        
        })
        .delete(function(req, res, next) {
            if(security.bow.hasAccess(req.token)) {
                bow.deleteBow(req.params.bowId).then(b => {
                    res.status(200).send({success:true});
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        });

    // [/bow] route
    router.route('/')
        .post(function(req, res, next) {
            if(security.bow.hasAccess(req.token)) {
                var b = req.body;
                b.member_id = 1;
                
                bow.createBow(b).then(b => {
                    res.status(201).send(b);
                }).catch(error => {
                    res.status(400).send(error);
                });        
            }
        });
};