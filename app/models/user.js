/**
 * The main object in this schema is user.  For now, it only holds the email
 * address and password.
 */
var mongoose = require('mongoose');

// Mongoose Schema definition
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    roles: [String],
    active: Boolean
});

module.exports = mongoose.model('User', userSchema);
