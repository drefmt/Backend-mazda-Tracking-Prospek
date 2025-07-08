const db = require("../models");
const User = db.users;

exports.getUserReport = async (req, res) => {
  try {
    const users = await User.find({}, "username email level createdAt").sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Failed to fetch user report:", error);
    res.status(500).json({ message: "An error occurred while retrieving user report." });
  }
};
