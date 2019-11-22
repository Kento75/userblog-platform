const express = require("express");
const router = express.Router();
const {
    signup,
    signin
} = require("../controllers/auth.js");

// validator middleware
const {
    runValidation
} = require("../validators");
// auth validator
const {
    userSignupValidator,
    userSigninValidator
} = require("../validators/auth.js");


router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);

module.exports = router;