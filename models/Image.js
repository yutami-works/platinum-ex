const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  images: [
    {
      raw: { type: String},
      original: { type: String},
      resize: { type: String}
    }
  ]
}, { collection: 'images' });

module.exports = mongoose.model('image', imageSchema);