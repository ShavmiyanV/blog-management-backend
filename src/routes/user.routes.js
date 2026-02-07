const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const {
  getProfile,
  getAllUsers,
  getUserById
} = require("../controllers/user.controller");

router.get("/profile", authMiddleware, getProfile);

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);

module.exports = router;
