var mongoose = require('mongoose');

// Mongoose Schema definition
var Schema = mongoose.Schema;

var scorecardSchema = new Schema({
  user: {
    email: String,
    userId: String,
    image: String,
    name: String,
    location: String
  },
  rounds: [{
    recordedDate: {type: Date, default: Date.now},
    bowName: String,
    score: Number,
    notes: String,
    location: String,
    ends: [{
      num: Number,
      score: Number
    }]
  }],
  bows: [{
    name: String,
    make: String,
    model: String,
    type: String,
    poundage: String,
    braceHeight: String,
    amoLength: String
  }]
});

module.exports = mongoose.model('Scorecard', scorecardSchema);