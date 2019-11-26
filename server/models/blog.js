const mongoose = require('mongoose');
const {
  ObjectId
} = mongoose.Schema;

// docs -> https://mongoosejs.com/docs/schematypes.html
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 160,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  body: {
    type: {},
    required: true,
    minlength: 200,
    maxlength: 200000,
  },
  excerpt: {
    type: String,
    maxlength: 1000
  },
  // meta
  mtitle: {
    type: String,
  },
  // meta
  mdesc: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  categories: [{
    type: Object,
    ref: "Category",
    required: true
  }],
  tags: [{
    type: Object,
    ref: "Tag",
    required: true
  }],
  // 執筆者
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
}, {
  timestamp: true,
});

module.exports = mongoose.model("Blog", blogSchema);