const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
  yelpId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  location: String,
  image_url: String,
  url: String,
  attendees: [String]
});

module.exports = mongoose.model('Bar', barSchema);
