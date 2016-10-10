// app/routes/bowtypes.js
var nconf = require('nconf');
var logger = require('winston');
var bow = require('../shared/bow');

module.exports = function(router) {
    
    'use strict';
      
    // [/bowtypes] route
    router.route('/')
        .get(function(req, res, next) {
            bow.getTypes().then(types => {
                res.status(200).send(types);
            }).catch(error => {
                res.status(400).send(error);
            });        
        });
};