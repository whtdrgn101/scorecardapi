// app/routes/bow.js
var nconf = require('nconf');
var logger = require('winston');
var round = require('../shared/round');

module.exports = function(router) {
    
    'use strict';
      
    // [/bow] route
    router.route('/')
        .get(function(req, res, next) {
            round.getTypes().then(b => {
                res.status(200).send(b);
            }).catch(error => {
                res.status(400).send(error);
            });        
        });
};