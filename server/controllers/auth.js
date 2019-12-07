const User = require('../models/user.js');
const Blog = require("../models/blog.js");
const shortId = require('shortid');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const {
    errorHandler
} = require("../helpers/dbErrorHandler.js");

exports.signup = (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        // すでに存在する場合
        if (user) {
            return res.status(400).json({
                error: 'Email is token',
            });
        }

        const {
            name,
            email,
            password
        } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        // User作成
        let newUser = new User({
            name,
            email,
            password,
            profile,
            username,
        });
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            res.json({
                user: success,
            });
        });
    });
};


exports.signin = (req, res) => {
    const {
        email,
        password
    } = req.body;
    // check if user exist
    User.findOne({
        email
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup."
            });
        }

        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match."
            });
        }

        // generate a token and send to client
        const token = jwt.sign({
                _id: user._id
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRE
            });

        res.cookie("token", token, {
            expiresIn: process.env.TOKEN_EXPIRE
        });

        const {
            _id,
            username,
            name,
            email,
            role
        } = user;

        return res.json({
            token,
            user: {
                _id,
                username,
                name,
                email,
                role
            }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Signout success"
    });
};

exports.requireSiginin = expressJwt({
    secret: process.env.JWT_SECRET
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({
        _id: authUserId
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
}

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({
        _id: adminUserId
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        // user role => 1の場合 Admin
        if (user.role !== 1) {
            return res.status(400).json({
                error: "Admin resource. Access denied"
            });
        }

        req.profile = user;
        next();
    });
}

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({
        slug: slug
    }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();

        if (!authorizedUser) {
            return res.status(400).json({
                error: "You are not authorized"
            });
        }

        next();
    });
}