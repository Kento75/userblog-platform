const express = require("express");
const router = express.Router();
const {
    requireSiginin,
    adminMiddleware,
} = require("../controllers/auth.js");
const {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    remove,
    update
} = require("../controllers/blog.js");

router.post("/blog", requireSiginin, adminMiddleware, create);
router.get("/blogs", list);
router.get("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSiginin, adminMiddleware, remove);
router.put("/blog/:slug", requireSiginin, adminMiddleware, update);

module.exports = router;