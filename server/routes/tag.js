const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read,
  remove
} = require("../controllers/tag.js");
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
  tagCreateValidator
} = require("../validators/tag.js");


// routes
router.post("/tag", tagCreateValidator, runValidation, requireSiginin, adminMiddleware, create);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSiginin, adminMiddleware, remove);

module.exports = router;