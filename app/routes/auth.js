/**
 * Created by tim on 9/28/2016.
 */
var nconf = require('nconf');
var logger = require('winston');
var user = require('../models/user');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var bcrypt = require('bcrypt');

module.exports = function(router) {
    'use strict';

    // This will handle the url calls for /user and return a list of topics
    router.route('/')
        .post(function(req, res, next) {

            if (!req.body.email || !req.body.password) {
                return res.status(400).send('Missing authorization fields');
            }
            //search for email and return the password for decryption kevinc 2/6/16
            user.findOne({email: req.body.email}, function(err, usr) {
                if (err || !usr) {
                    return res.status(401).send({
                        success: false,
                        message: 'Authentication failed'
                    });
                } else {
                    //decrypt and compare passwords kevinc 2/6/16
                    bcrypt.compare(req.body.password, usr.password, function(err, ret) {
                        if (err || !ret) {
                            return res.status(401).send({
                                success: false,
                                message: 'Authentication failed'
                            });
                        } else {
                            var cert = fs.readFileSync(nconf.get('authKeyFile'));
                            var token = jwt.sign(usr, cert, {
                                expiresIn: 17280
                            });
                            res.status(200).send({
                                success: true,
                                token: token,
                                userId: usr._id,
                                roles: usr.roles
                            });
                        }
                    });
                }
            });
        });
};