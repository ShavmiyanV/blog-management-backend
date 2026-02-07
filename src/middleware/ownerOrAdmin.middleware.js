const db = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Admin can access any blog
    if (userRole === "admin") {
      return next();
    }

    // Check if user is the blog owner
    const [blogs] = await db.query("SELECT author_id FROM blogs WHERE id = ?", [blogId]);

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blogs[0].author_id !== userId) {
      return res.status(403).json({ message: "Access denied. You can only update your own blogs." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking permissions", error: error.message });
  }
};
