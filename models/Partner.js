const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  name: String,
  birth: String,
  tall: String,
  figure: String,
  job: String,
  from: String,
  live: String,
  connect: String,
  quit: String,
  like: Number,
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { collection: 'partners', timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);