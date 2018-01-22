/**
 * Created by tim on 9/28/2016.
 */
var nconf = require('nconf');
var logger = require('winston');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var member = require('../shared/member');

module.exports = function(router) {
    'use strict';

    // This will handle the url calls for /user and return a list of topics
    router.route('/')
        .post(function(req, res, next) {

            if (!req.body.email || !req.body.password) {
                return res.status(400).send('Missing authorization fields');
            }
            //search for email and return the password for decryption kevinc 2/6/16
            member.getMemberByEmail(req.body.email).then(user => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: 'Authentication failed'
                    });
                } else {
                    //decrypt and compare passwords kevinc 2/6/16
                    bcrypt.compare(req.body.password, user.password, function(err, ret) {
                        if (err || !ret) {
                            return res.status(401).send({
                                success: false,
                                message: 'Authentication failed'
                            });
                        } else {
                            var cert = fs.readFileSync(nconf.get('authKeyFile'));
                            var token = jwt.sign(user, cert, {
                                expiresIn: 86400
                            });
                            res.status(200).send({
                                success: true,
                                token: token,
                                userId: user.id,
                                email: user.email
                            });
                        }
                    });
                }
            });
        });
};