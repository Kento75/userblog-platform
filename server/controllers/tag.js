const Tag = require("../models/tag.js");
const slugify = require("slugify");
const {
  errorHandler
} = require("../helpers/dbErrorHandler.js");

exports.create = (req, res) => {
  const {
    name
  } = req.body;
  // slugの整形・生成
  let slug = slugify(name).toLowerCase();

  let tag = new Tag({
    name,
    slug
  });

  tag.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json(data);
  });
};

exports.list = (req, res) => {
  Tag.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOne({
    slug
  }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(tag);
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOneAndRemove({
    slug
  }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: "Tag deleted successfully"
    });
  });
};