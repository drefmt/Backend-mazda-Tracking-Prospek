const db = require("../models");
const Spk = db.spk;
const Prospek = db.prospek;
const logger = require("../utils/logger");


exports.createSpk = async (req, res) => {
  try {
    const userId = req.user.id;

    const {      
      prospekId,
      dateSpk,
      noKtp,      
      cashOrCredit,
      downPayment,
      tenor,
      leasing,
      status
    } = req.body;

    const exitingProspek = await Prospek.findOne({ _id: prospekId ,salesId: userId, });

    if (!exitingProspek) {
      logger.warn("Prospek tidak ditemukan atau bukan milik user", { userId, prospekId });
      return res.status(404).send({ message: "Prospek tidak ditemukan atau bukan milik Anda" });
    }

    const newSpk = new Spk({
      salesId: userId,
      prospekId,
      dateSpk,
      noKtp,      
      cashOrCredit,
      downPayment,
      tenor,
      leasing,
      status
    });

    const savedSpk = await newSpk.save();
    logger.info("SPK berhasil ditambahkan");
    
    res.status(201).send({ message: "SPK berhasil ditambahkan", newSpk: savedSpk });
  } catch (error) {
    logger.error("Terjadi kesalahan saat menambahkan SPK", { error: error.message });
    res.status(500).send({ message: "Terjadi kesalahan saat menambahkan SPK", error: error.message });
  }
};

exports.findAllSpk = async (req, res) => {
  try {
    const userId = req.user.id;    
    const userLevel = req.user.level;
    let spk;

    if (userLevel === "svp") {
      spk = await Spk.find().populate("salesId", "username").populate("prospekId", "name whatsappNum carType address").sort({createdAt: -1});
    } else {
      spk = await Spk.find({ salesId: userId }).populate("salesId", "username").populate("prospekId", "name whatsappNum carType address").sort({createdAt: -1});
    }

    logger.info("SPK berhasil diambil", { userId, count: spk.length });
    res.status(200).send(spk);
  } catch (error) {
    logger.error("Terjadi kesalahan saat mengambil SPK", { error: error.message });
    res.status(500).send({ message: error.message });
  }
};

exports.findSpkById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Allow user level 'svp' to view SPK by ID
    const spk = await Spk.findOne({ _id: id }).populate("prospekId", "name whatsappNum carType address");

    if (!spk || (spk.salesId.toString() !== userId && req.user.level !== 'svp')) {
      logger.warn("SPK tidak ditemukan", { spkId: id, userId });
      return res.status(404).send({ message: "SPK tidak ditemukan atau bukan milik Anda" });
    }

    logger.info("SPK berhasil ditemukan", { spkId: id, userId });
    res.status(200).send(spk);
  } catch (error) {
    logger.error("Terjadi kesalahan saat mencari SPK", { error: error.message });
    res.status(500).send({ message: error.message });
  }
};

exports.updateSpk = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedSpk = await Spk.findOneAndUpdate(
      { _id: id, salesId: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSpk) {
      logger.warn("SPK tidak ditemukan untuk update", { spkId: id, userId });
      return res.status(404).send({ message: "SPK Tidak ditemukan" });
    }

    logger.info("SPK berhasil diperbarui", { spkId: id, userId });
    res.status(200).send({ message: "SPK updated successfully", data: updatedSpk });
  } catch (error) {
    logger.error("Terjadi kesalahan saat memperbarui SPK", { error: error.message });
    res.status(500).send({ message: error.message });
  }
};

exports.deleteSpk = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedSpk = await Spk.findOneAndDelete({ _id: id, salesId: userId });

    if (!deletedSpk) {
      logger.warn("SPK tidak ditemukan untuk dihapus", { spkId: id, userId });
      return res.status(404).send({ message: "SPK not found" });
    }

    logger.info("SPK berhasil dihapus", { spkId: id, userId });
    res.status(200).send({ message: "SPK deleted successfully" });
  } catch (error) {
    logger.error("Terjadi kesalahan saat menghapus SPK", { error: error.message });
    res.status(500).send({ message: error.message });
  }
};


