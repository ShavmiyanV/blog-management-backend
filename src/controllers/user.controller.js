const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const query =
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?";

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User profile fetched successfully",
        user: results[0],
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
};
