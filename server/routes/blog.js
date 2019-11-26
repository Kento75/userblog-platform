const express = require("express");
const router = express.Router();
const {
    requireSiginin,
    adminMiddleware,
} = require("../controllers/auth.js");
const {
    create
} = require("../controllers/blog.js");

router.post("/blog", requireSiginin, adminMiddleware, create);

module.exports = router;