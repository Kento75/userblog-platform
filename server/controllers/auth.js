const User = require('../models/user.js');
const shortId = require('shortid');

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