const express = require("express");
const router = express.Router();
const {
  create
} = require("../controllers/category.js");
const {
  requireSiginin,
  adminMiddleware
} = require("../controllers/auth.js");

// validator middleware
const {
  runValidation
} = require("../validators");
// auth validator
const {
  categoryCreateValidator
} = require("../validators/category.js");

router.post("/category", categoryCreateValidator, runValidation, requireSiginin, adminMiddleware, create);

module.exports = router;