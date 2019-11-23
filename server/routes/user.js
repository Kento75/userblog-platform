const express = require("express");
const router = express.Router();
const {
  requireSiginin,
  authMiddleware,
} = require("../controllers/auth.js");
const {
  read
} = require("../controllers/user.js");

router.get("/profile", requireSiginin, authMiddleware, read);

module.exports = router;