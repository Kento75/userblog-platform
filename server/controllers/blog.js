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

exports.list = (req, res) => {
    Blog.find({})
        .populate("categories", "_id name slug") // これでjoinできる(category)
        .populate("tags", "_id name slug") // これでjoinできる(tag)
        .populate("postedBy", "_id name username") // これでjoinできる(author)
        .select("_id title slug excerpt categories tags postedBy createdAt updatedAt")
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
}
exports.listAllBlogsCategoriesTags = (req, res) => {
    // レスポンスするレコードの上限
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    // 検索From
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate("categories", "_id name slug") // これでjoinできる(category)
        .populate("tags", "_id name slug") // これでjoinできる(tag)
        .sort({
            createdAt: -1 // 降順
        })
        .skip(skip) // 指定したレコード以降
        .limit(limit) // レスポンスするレコードの上限
        .select("_id title slug excerpt categories tags postedBy createdAt updatedAt")
        .exec((err, data) => {
            if (err) {
                return (
                    res.json({
                        error: errorHandler(err)
                    })
                );
            }
            blogs = data;
            Category.find({}).exec((err, q_categories) => {
                if (err) {
                    return (
                        res.json({
                            error: errorHandler(err)
                        })
                    );
                }
                categories = q_categories;
                Tag.find({}).exec((err, q_tags) => {
                    if (err) {
                        return (
                            res.json({
                                error: errorHandler(err)
                            })
                        );
                    }
                    tags = q_tags;

                    res.json({
                        blogs,
                        categories,
                        tags,
                        size: blogs.length
                    });
                })
            });
        })
}

exports.read = (req, res) => {
    const slug = req.body.slug.toLowerCase();
    Blog.findOne({
            slug: slug
        })
        .populate("categories", "_id name slug") // これでjoinできる(category)
        .populate("tags", "_id name slug") // これでjoinできる(tag)
        .populate("postedBy", "_id name username") // これでjoinできる(author)
        .select("_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt")
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            };
            res.json(data);
        });
}

exports.remove = (req, res) => {
    const slug = req.body.slug.toLowerCase();
    Blog.findOneAndRemove({
        slug: slug
    }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Blog deleted successfully"
        });
    })
}

exports.update = (req, res) => {}