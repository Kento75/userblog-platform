const mongoose = require('mongoose');

// docs -> https://mongoosejs.com/docs/schematypes.html
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  slug: {
    type: String,
    trim: false,
    unique: true,
    index: true
  },
}, {
  timestamp: true,
});

module.exports = mongoose.model("Tag", tagSchema);