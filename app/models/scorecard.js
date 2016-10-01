/**
 * The main object in this schema is scorecard.  All other items are embedded
 * documents.  This is done because in mongoose, the _id values are update when
 * you push new versions of these embedded documents but not the parent ID of
 * the scorecard.  Not sure why this is but it is...  I'll sort that out
 * once I get the main app working...
 */
var mongoose = require('mongoose');

// Mongoose Schema definition
var Schema = mongoose.Schema;

var bowSchema = new Schema({
    name: String,
    make: String,
    model: String,
    type: String,
    poundage: String,
    braceHeight: String,
    amoLength: String
});

var endsSchema = new Schema({
  number: Number,
  score: Number
});

var roundSchema = new Schema({
    recordedDate: {type: Date, default: Date.now},
    roundType: String,
    bowName: String,
    score: Number,
    notes: String,
    location: String,
    ends: [endsSchema]
});

var userSchema = new Schema({
  email: String,
  accountId: String,
  image: String,
  name: String,
  location: String
});

var scorecardSchema = new Schema({
  user: userSchema,
  rounds: [roundSchema],
  bows: [bowSchema]
});

module.exports = mongoose.model('Scorecard', scorecardSchema);
