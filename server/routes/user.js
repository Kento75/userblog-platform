const express = require("express");
const router = express.Router();
const {
  requireSiginin,
  authMiddleware,
} = require("../controllers/auth.js");
const {
  read,
  publicProfile,
  update,
  photo
} = require("../controllers/user.js");

router.get("/profile", requireSiginin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update", requireSiginin, authMiddleware, update);
router.get("/user/photo/:username", photo);

module.exports = router;