const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const ownerOrAdminMiddleware = require("../middleware/ownerOrAdmin.middleware");
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require("../controllers/blog.controller");

//GET /blogs
router.get("/", getBlogs);

//GET /blogs/:id
router.get("/:id", getBlogById);

//POST /blogs (Protected)
router.post("/", authMiddleware, createBlog);

//PUT /blogs/:id (Owner OR Admin)
router.put("/:id", authMiddleware, ownerOrAdminMiddleware, updateBlog);

//DELETE /blogs/:id (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;