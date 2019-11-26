const formidable = require("formidable"); // imageファイルとかをStringにするやつ
const slugify = require("slugify");
const stripHtml = require("string-strip-html"); // htmlタグとか空白を取り除くやつ
const _ = require("lodash");
const fs = require("fs");

const Blog = require("../models/blog.js");
const Category = require("../models/category.js");
const Tag = require("../models/tag.js");

const {
    errorHandler
} = require("../helpers/dbErrorHandler.js");
const {
    smartTrim
} = require("../helpers/blog.js");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not upload"
            });
        }

        const {
            title,
            body,
            categories,
            tags
        } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: "title is required"
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: "Content is to short"
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: "At least one category is required"
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: "At least one tag is required"
            });
        }
        if (typeof files.photo === "undefined" || typeof files.photo.path === "undefined") {
            return res.status(400).json({
                error: "Image is required"
            });
        }

        // イメージが大きすぎる場合
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: "Image should be less then 1mb in size"
                });
            }
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, " ", "...");
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160));
        blog.postedBy = req.user._id;

        // categories an tags
        let arrayOfCategories = categories && categories.split(",");
        let arrayOfTags = tags && tags.split(",");

        blog.photo.data = fs.readFileSync(files.photo.path);
        blog.photo.contentType = files.photo.type;

        blog.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            Blog.findByIdAndUpdate(result._id, {
                $push: {
                    categories: arrayOfCategories
                }
            }, {
                new: true
            }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                    Blog.findByIdAndUpdate(result._id, {
                        $push: {
                            tags: arrayOfTags
                        }
                    }, {
                        new: true
                    }).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        } else {
                            res.json(result);
                        }
                    });
                }
            });
        });
    })
};