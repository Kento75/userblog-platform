const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read,
  remove
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


// routes
router.post("/category", categoryCreateValidator, runValidation, requireSiginin, adminMiddleware, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSiginin, adminMiddleware, remove);

module.exports = router;