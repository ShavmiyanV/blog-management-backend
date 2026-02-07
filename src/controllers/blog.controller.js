const db = require("../config/db");
const generateSummary = require("../utils/summaryGenerator");

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const summary = generateSummary(content);

  await db.query(
    "INSERT INTO blogs (title, content, summary, author_id) VALUES (?, ?, ?, ?)",
    [title, content, summary, req.user.id],
  );

  res.status(201).json({ message: "Blog created" });
};

exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const [blogs] = await db.query("SELECT * FROM blogs LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);

  res.json(blogs);
};
