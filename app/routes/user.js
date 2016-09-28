// app/routes/user.js
var nconf = require('nconf');
var logger = require('winston');
var user = require('../models/user');
var _ = require('underscore');

module.exports = function(router) {
  'use strict';
  
  // This will handle the url calls for /user/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {

    user.findOne({'_id': req.params.userId})
        .then(results => {
            if(results) {
                res.status(200).send(results);
            } else {
                res.sendStatus(404);
            }
                
        })
        .catch(error => {
            res.status(400).send({message:error});
        });

  })
  .put(function(req, res, next) {

    user.findOne({'_id': req.params.userId})
        .then(user => {
            if(user){
                user.update(req.body).then(results => {
                    res.status(202).send(user);    
                });    
            } else {
                res.sendStatus(404);
            }
            
        })
        .catch(error => {
            res.status(400).send({message:error});
        });
  })
  .delete(function(req, res, next) {
    user.findOne({'_id': req.params.userId}).remove().then(results => {
        res.sendStatus(202);
    }).catch(error => {
      res.sendStatus(500);
    });

  });

  // [/user] route
  router.route('/')
      .post(function(req, res, next) {
        var usr = new user(req.body);
        usr.save();
        res.status(201).send(usr);
      });
};