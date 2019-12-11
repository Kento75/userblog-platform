const express = require('express');
const router = express.Router();
const {
  preSignup,
  signup,
  signin,
  signout,
  requireSiginin,
  forgotPassword,
  resetPassword,
  googleLogin
} = require('../controllers/auth.js');

// validator middleware
const {
  runValidation
} = require('../validators');
// auth validator
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.js');

router.post('/pre-signup', userSignupValidator, runValidation, preSignup);
router.post('/signup', signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

// reset and forgot password routes
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
);

// google login
router.post("/google-login", googleLogin);

module.exports = router;