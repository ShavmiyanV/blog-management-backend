const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
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

//PUT /blogs/:id (Protected)
router.put("/:id", authMiddleware, updateBlog);

//DELETE /blogs/:id (Protected)
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;