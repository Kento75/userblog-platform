const _ = require('lodash');

const User = require('../models/user.js');
const Blog = require('../models/blog.js');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const {errorHandler} = require('../helpers/dbErrorHandler.js');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.preSignup = (req, res) => {
  const {name, email, password} = req.body;

  User.findOne(
    {
      email: email.toLowerCase(),
    },
    (err, user) => {
      if (user) {
        return res.status(400).json({
          error: 'Email is token',
        });
      }

      const token = jwt.sign(
        {
          name,
          email,
          password,
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: process.env.TOKEN_EXPIRE,
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
            <p>Please use the following link to activate your account:</p>
            <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://userblog.com</p>
            `,
      };

      sgMail.send(emailData).then(sent => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
        });
      });
    }
  );
};

exports.signup = (req, res) => {
  const token = req.body.token;

  // token 存在する場合
  if (token) {
    // jwt check
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: 'Expired link. Signup again',
        });
      }

      const {name, email, password} = jwt.decode(token);

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({
        name,
        email,
        password,
        profile,
        username,
      });

      user.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        }

        return res.json({
          message: 'Signup success! Please signin',
        });
      });
    });

    // token 存在しない場合
  } else {
    return res.json({
      message: 'Something went wrong. Try again',
    });
  }
};

exports.signin = (req, res) => {
  const {email, password} = req.body;
  // check if user exist
  User.findOne({
    email,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup.',
      });
    }

    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.',
      });
    }

    // generate a token and send to client
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRE,
      }
    );

    res.cookie('token', token, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });

    const {_id, username, name, email, role} = user;

    return res.json({
      token,
      user: {
        _id,
        username,
        name,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success',
  });
};

exports.requireSiginin = expressJwt({
  secret: process.env.JWT_SECRET,
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({
    _id: authUserId,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({
    _id: adminUserId,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    // user role => 1の場合 Admin
    if (user.role !== 1) {
      return res.status(400).json({
        error: 'Admin resource. Access denied',
      });
    }

    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({
    slug: slug,
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();

    if (!authorizedUser) {
      return res.status(400).json({
        error: 'You are not authorized',
      });
    }

    next();
  });
};

exports.forgotPassword = (req, res) => {
  const {email} = req.body;

  User.findOne(
    {
      email: email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: 'User with that email does not exist',
        });
      }

      // 一時認証用トークン生成
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRE,
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password reset link`,
        html: `
                <p>Please use the following link to reset your password:</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://userblog.com</p>
            `,
      };

      return user.updateOne(
        {
          resetPasswordLink: token,
        },
        (err, success) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          } else {
            sgMail.send(emailData).then(sent => {
              return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min`,
              });
            });
          }
        }
      );
    }
  );
};

exports.resetPassword = (req, res) => {
  const {resetPasswordLink, newPassword} = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: 'Expired link. Try again',
        });
      }
      User.findOne(
        {
          resetPasswordLink,
        },
        (err, user) => {
          if (err || !user) {
            return res.status(401).json({
              error: 'Something went wrong. Try later',
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json({
              message: `Great! Now you can login with your new password`,
            });
          });
        }
      );
    });
  }
};
