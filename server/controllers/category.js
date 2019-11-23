const Category = require("../models/category.js");
const slugify = require("slugify");

exports.create = (req, res) => {
  const {
    name
  } = req.body;
  // slugの整形・生成
  let slug = slugify(name).toLowerCase();

  let category = new Category({
    name,
    slug
  });

  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }

    res.json(data);
  })
}