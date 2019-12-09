const express = require("express");
const router = express.Router();
const {
  contactForm
} = require("../controllers/form.js");

// validator middleware
const {
  runValidation
} = require("../validators");
const {
  contactFormValidator
} = require("../validators/form.js");


// routes
router.post("/contact", contactFormValidator, runValidation, contactForm);

module.exports = router;