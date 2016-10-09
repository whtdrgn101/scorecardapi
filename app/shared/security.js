var nconf = require('nconf');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var P = require('bluebird');
var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = {

    routing: {
        authorize: function(roles, req) {
            return new P( function(resolve, reject) {
                roles = roles || [];
                var cert = fs.readFileSync(nconf.get('authKeyFile'));
                var token = req.header('X-Authorization');

                if (token) {
                    jwt.verify(token, cert, function(err, decoded) {
                        if (!err && decoded._doc.roles) {
                            var found = roles.length === 0 || _.find(decoded._doc.roles, r => (_.contains(roles, r.name)));
                            if (found) {
                                req.decodedToken = decoded;
                                resolve(decoded);
                            }
                        }

                        reject({code: 403, message: 'Not authorized'});

                    });
                } else {
                    reject({code: 403, message: 'Not authorized'});
                }
            });
        },

        /**
         * Used to require routes to have the JWT token header and optionally
         * restrict access to one or more roles.
         *
         * Sample use:
         *
         *  router.use(filters.token());
         *
         *  or with roles:
         *
         *  router.use(filters.token(['admin']);
         *
         * If access is granted, the request will contain a new variable called 'decodedToken'
         * which is the decoded JWT token.
         *
         * @param array roles Optional. Specify one or more role names that
         * will be required to gain access.
         */
        token: function(roles) {
            return function(req, res, next) {
                if (req.method === 'OPTIONS') {
                    next();
                    return;
                }

                roles = roles || [];

                var cert = fs.readFileSync(nconf.get('authKeyFile'));
                var token = req.header('X-Authorization');

                if (token) {
                    jwt.verify(token, cert, function(err, decoded) {
                        if (!err && decoded._doc.roles) {
                            var found = roles.length === 0 || _.find(decoded._doc.roles, r => (_.contains(roles, r.name)));
                            if (found) {
                                req.decodedToken = decoded;
                                next();
                                return;
                            }
                        }

                        return res.status(403).send({
                            success: false,
                            message: 'Not Authorized to perform this action'
                        });

                    });
                } else {
                    return res.status(403).send({
                        success: false,
                        message: 'No auth token provided.'
                    });
                }
            };
        }
    },

    user: {
        /**
         * Creates a user record.
         *
         * @param object data Data for the user. Valid properties are any defined
         * in app/models/user.js. However, email and password are required.
         *
         * @param function callback The callback to invoke when finished. The
         * callback signature should be:
         *
         * function(err, user);
         *
         * Where:
         *      err is a string that will be non-null if an error occurred.
         *      user The inserted user.
         */

        create: function (data) {
            return new P( function(resolve, reject) {
                if (!_.every(['email', 'password'], _.partial(_.has, data))) {
                    return reject({code: 400, message: 'Must provide a valid email and password'});
                }

                //see if the user already exists
                User.findOne({email: data.email}).then(result => {
                    if (!_.isEmpty(result)) {
                        return reject({code: 403, message: 'This email is already registered'});
                    }

                    var usr = new User(data);
                    usr.roles = ['user'];

                    //generate the hashed password
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            return reject({code: 400, message: 'An error occurred ' + err.message});
                        }

                        bcrypt.hash(data.password, salt, function (err, hash) {
                            if (err) {
                                return reject({code: 400, message: 'An error occurred ' + err.message});
                            }

                            //create the user
                            usr.password = hash;
                            usr.active = true;

                            usr.save().then(user => {
                                resolve(user);
                            });
                        });
                    });
                });
            });
        },
        update: function(userObj, token) {
            return new P( function(resolve, reject) {
                if (!_.isEmpty(userObj.roles) && !_.find(token._doc.roles, r => (r.name === 'admin'))) {
                    return reject({code: 403, message: 'Not authorized to update this user'});
                }

                User.findOne({_id: userObj.Id}).exec().then(user => {
                    if (_.isEmpty(user)) {
                        return reject({code: 404, message: 'No record found'});
                    }

                    if (_.has(userObj, 'ministryId')) {
                       var userMinistryId = sm.GetMinistryId(userObj.ministryId);

                        if(_.isEmpty(userMinistryId)){
                            return reject({code: 400, message: 'Sharing Ministry Not Found'});
                        } else {
                            userObj.ministryId = userMinistryId;
                        }
                    }

                    if (_.has(userObj, 'newPassword')) {
                        module.exports.user.encrypt(userObj).then(hash => {
                            userObj.password = hash;
                        });
                    }
                    user.update(userObj).then(ret => {
                        resolve(ret);
                    }).catch(error => {
                        reject({code: 400, message: 'An error occurred: ' + error.message});
                    });
                }).catch(error => {
                    reject({code: 400, message: 'An error occurred: ' + error.message});
                });
            });
        },
        encrypt: function(data){
            return new P(function(resolve, reject){
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        return reject(err);
                    }

                    bcrypt.hash(data.newPassword, salt, function (err, hash) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(hash);
                    });
                });
            });
        },
        hasAdminAccess: function (token) {
            if (_.find(token._doc.roles, r => (r.name === 'admin'))) {
                return true;
            }else {
                return false;
            }
        },

        /**
         * Determines if the given JWT token allows access to a particular user.
         *
         * @param object The decoded JWT token on an authorized request.
         * @param string A user's ID.
         *
         * @return bool True if the request is authorized to access the user, false otherwise.
         */
        hasAccess: function (token, userId) {
            if (_.find(token._doc.roles, r => (r.name === 'admin'))) {
                return true;
            }

            return token._doc._id === userId;
        }
    },
    bow: {
        hasAccess: function(token) {
            return true;
        }
    }

};