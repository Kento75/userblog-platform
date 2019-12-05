const express = require("express");
const router = express.Router();
const {
  requireSiginin,
  authMiddleware,
} = require("../controllers/auth.js");
const {
  read,
  publicProfile
} = require("../controllers/user.js");

router.get("/profile", requireSiginin, authMiddleware, read);
router.get("/user/:username", publicProfile);

module.exports = router;