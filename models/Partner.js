const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  hash: { type: String, required: true , unique: true },
  partnerNumber: String,
  join: { type: Date },
  name: String,
  birth: { type: Date },
  height: { type: Number},
  figure: String,
  job: String,
  from: String,
  live: String,
  blood: String,
  horoscope: String,
  quit: { type: Boolean, default: false },
  private: { type: Boolean, default: false },
  negotiate: { type: Boolean, default: false },
  connect: { type: Boolean, default: false },
  like: { type: Number, default: 0 },
  images: [
    {
      display: { type: Boolean, default: false },
      raw: String,
      original: String,
      resize: String
    }
  ]
}, { collection: 'partners', timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);