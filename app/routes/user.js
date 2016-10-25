// app/routes/user.js
var nconf = require('nconf');
var logger = require('winston');
var _ = require('underscore');
var security = require('../shared/security');
var member = require('../shared/member');

module.exports = function(router) {
  'use strict';
  
    // [/user] route
    router.route('/')
        .post(function(req, res, next) {
            security.user.create(req.body).then(results=>{
                res.status(201).send(results);
            }).catch(error => {
                res.status(400).send(error.message);
            });
        });
      
  // This will handle the url calls for /user/:user_id
  router.route('/:userId')
  .get(function(req, res, next) {
    if(member.hasAccess(req.token, req.params.userId)){
        member.getMember(req.params.userId)
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
    } else {
        res.status(403).send('NOT AUTHORIZED!');
    }
    

  })
  .put(function(req, res, next) {

    if(member.hasAccess(req.token, req.params.userId)){
        member.getMember(req.params.userId)
        .then(user => {
            console.log(req.body);
            if(user){
                req.body.id = req.params.userId;
                security.user.update(req.body).then(results => {
                    res.status(202).send(results);    
                });
            } else {
                res.sendStatus(404);
            }
            
        })
        .catch(error => {
            res.status(400).send({message:error});
        });
    } else {
        res.status(403).send('NOT AUTHORIZED!');
    }
    
  })
  .delete(function(req, res, next) {
      if(member.hasAccess(req.token, req.params.userId)){
        member.deleteMember(req.params.userId).then(results => {
            res.sendStatus(202);
        }).catch(error => {
          res.sendStatus(500);
        });  
      } else {
          res.status(403).send('NOT AUTHORIZED!');
      }
    
  });
    
    router.route('/:userId/bows')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)){
                var bow = require('../shared/bow');
                bow.getMemberBows(req.params.userId).then(bows => {
                    res.status(200).send(bows);
                }).catch(error => {
                    res.status(400).send(error);
                });
            }
        });
    router.route('/:userId/rounds')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)){
                var round = require('../shared/round');
                round.getMemberRounds(req.params.userId).then(rounds => {
                    res.status(200).send(rounds);
                }).catch(error => {
                    res.status(400).send(error);
                });
            }
        });
    router.route('/:userId/profile')
        .get(function(req, res, next) {
            if(member.hasAccess(req.token, req.params.userId)){
                member.getMemberProfile(req.params.userId).then(profile => {
                    var p = (profile.length > 0)?profile[0]:{};
                    res.status(200).send(p);
                }).catch(error => {
                    res.status(400).send(error);
                });
            }
        });
  
};