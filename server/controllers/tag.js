const Tag = require("../models/tag.js");
const Blog = require("../models/blog.js");
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
    slug: slug
  }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    Blog.find({
        tags: tag._id.toString()
      })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        res.json({
          tag: tag,
          blogs: data
        });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOneAndRemove({
    name: slug
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