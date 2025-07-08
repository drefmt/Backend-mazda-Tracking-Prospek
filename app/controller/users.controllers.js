const db = require("../models/index");
const User = db.users;
const jwt = require('jsonwebtoken');
const logger = require("../utils/logger"); // Import logger

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password, level } = req.body;
    
    if (!username || !email || !password) {
      logger.warn("Pendaftaran gagal: Field yang diperlukan hilang", { username, email });
      return res.status(400).json({ message: "Silakan lengkapi semua field yang diperlukan" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn("Pendaftaran gagal: Email sudah digunakan", { email });
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const user = new User({ username, email, password, level });
    const savedUser = await user.save();
    logger.info("Pengguna berhasil terdaftar", { userId: savedUser._id });
    res.status(201).json(savedUser);
  } catch (error) {
    logger.error("Kesalahan saat pendaftaran", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      logger.warn("Login gagal: Username atau password hilang", { username });
      return res.status(400).json({ message: "Silakan masukkan username dan password" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      logger.warn("Login gagal: Username tidak ditemukan", { username });
      return res.status(400).json({ message: "Username tidak ditemukan" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn("Login gagal: Username atau password tidak valid", { username });
      return res.status(400).json({ message: "Username atau password tidak valid" });
    }

    const token = jwt.sign(
        { id: user._id, level: user.level, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", 
    //   sameSite: "strict", 
    //   maxAge: 3600000, 
    // });

    logger.info("Pengguna berhasil login", { userId: user._id });
    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        username: user.username,        
        level: user.level,
      },
    });
  } catch (error) {
    logger.error("Kesalahan saat login", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      logger.warn("Tidak ada pengguna ditemukan");
      return res.status(404).json({ message: "Tidak ada pengguna ditemukan" });
    }

    logger.info("Semua pengguna berhasil diambil", { count: users.length });
    res.status(200).json(users);
  } catch (error) {
    logger.error("Kesalahan saat mengambil pengguna", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn("Pengguna tidak ditemukan", { userId: req.params.id });
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    logger.info("Pengguna ditemukan", { userId: user._id });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Kesalahan saat mengambil pengguna berdasarkan ID", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      logger.warn("Pengguna tidak ditemukan untuk diperbarui", { userId: req.params.id });
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    logger.info("Pengguna berhasil diperbarui", { userId: user._id });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Kesalahan saat memperbarui pengguna", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      logger.warn("Pengguna tidak ditemukan untuk dihapus", { userId: req.params.id });
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    logger.info("Pengguna berhasil dihapus", { userId: user._id });
    res.status(204).json({message: "Pengguna berhasil dihapus"});
  } catch (error) {
    logger.error("Kesalahan saat menghapus pengguna", { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
