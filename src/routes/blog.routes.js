const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
    createBlog,
    getBlogs,
} = require("../controllers/blog.controller");

//GET /blogs
router.get("/", getBlogs);

//POST /blogs (Protected)
router.post("/", authMiddleware, createBlog);

module.exports = router;