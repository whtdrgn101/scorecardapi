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
  num: Number,
  score: Number
});

var roundSchema = new Schema({
    recordedDate: {type: Date, default: Date.now},
    bowName: String,
    score: Number,
    notes: String,
    location: String,
    ends: [endsSchema]
});

var userSchema = new Schema({
  email: String,
  serId: String,
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