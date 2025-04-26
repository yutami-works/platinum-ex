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
  delete: String
}, { collection: 'partners' });

module.exports = mongoose.model('Partner', partnerSchema);