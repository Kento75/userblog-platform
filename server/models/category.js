const mongoose = require('mongoose');

// docs -> https://mongoosejs.com/docs/schematypes.html
const categorySchema = new mongoose.Schema({
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
  timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);