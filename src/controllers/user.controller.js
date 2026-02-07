const db = require("../config/db");

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [userId]
  );

  res.json(rows[0]);
};

// Admin: get all users
exports.getAllUsers = async (req, res) => {
  const [users] = await db.query(
    "SELECT id, name, email, role FROM users"
  );
  res.json(users);
};

// Protected: get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
};
