const db = require("../config/db");
const generateSummary = require("../utils/summaryGenerator");

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const summary = generateSummary(content);

    await db.query(
      "INSERT INTO blogs (title, content, summary, author_id) VALUES (?, ?, ?, ?)",
      [title, content, summary, req.user.id],
    );

    res.status(201).json({ message: "Blog created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [blogs] = await db.query("SELECT * FROM blogs LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [blogs] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blogs[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const summary = generateSummary(content);

    const [result] = await db.query(
      "UPDATE blogs SET title = ?, content = ?, summary = ? WHERE id = ?",
      [title, content, summary, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};
