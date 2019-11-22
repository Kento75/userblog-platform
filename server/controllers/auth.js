const User = require('../models/user.js');
const shortId = require('shortid');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

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