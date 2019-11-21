const express = require("express");
const router = express.Router();
const {
    signup
} = require("../controllers/auth.js");

// validator middleware
const {
    runValidation
} = require("../validators");
// auth validator
const {
    userSignupValidator
} = require("../validators/auth.js");


router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = router;