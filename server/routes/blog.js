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
    update,
    photo
} = require("../controllers/blog.js");

router.post("/blog", requireSiginin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSiginin, adminMiddleware, remove);
router.put("/blog/:slug", requireSiginin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);

module.exports = router;