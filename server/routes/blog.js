const express = require("express");
const router = express.Router();
const {
    requireSiginin,
    adminMiddleware,
    authMiddleware,
    canUpdateDeleteBlog
} = require("../controllers/auth.js");
const {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    remove,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser
} = require("../controllers/blog.js");

router.post("/blog", requireSiginin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSiginin, adminMiddleware, remove);
router.put("/blog/:slug", requireSiginin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);

// auth user crud
router.post("/user/blog", requireSiginin, authMiddleware, create);
// router.get("/:username/blogs", listByUser);
router.delete("/user/blog/:slug", requireSiginin, authMiddleware, canUpdateDeleteBlog, remove);
router.put("/user/blog/:slug", requireSiginin, authMiddleware, canUpdateDeleteBlog, update);

module.exports = router;