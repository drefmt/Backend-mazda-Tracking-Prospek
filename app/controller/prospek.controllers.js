const db = require("../models");
const Prospek = db.prospek;
const logger = require("../utils/logger");
const User = db.users;
const SPK = db.spk;
const Notification = db.notification;

exports.createProspek = async (req, res) => {
  try {
    const salesId = req.user.id;
    const salesName = req.user.username;
    const {
      name,
      date,
      whatsappNum,
      address,
      source,
      status,
      carType,
      category,
    } = req.body;
    const newProspek = new Prospek({
      salesId,
      name,
      date,
      whatsappNum,
      address,
      source,
      status,
      carType,
      category,
    });

    const prospek = await newProspek.save();
    const svp = await User.findOne({ level: "svp" });

    if (svp) {
      console.log("find supervisor: ", svp.username);
      await Notification.create({
        recipientId: svp._id,
        level: "svp",
        title: "Prospek Baru",
        message: `Sales ${salesName} menambahkan - ${prospek.name}`,
      });
    }

    logger.info(
      `Prospek berhasil dibuat  berhasil diperbarui oleh user ${salesName}`
    );
    res
      .status(201)
      .json({ message: "Prospek berhasil ditambahkan", data: prospek });
  } catch (error) {
    logger.error(`Kesalahan saat membuat prospek: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.findAllProspek = async (req, res) => {
  try {
    const salesId = req.user.id;
    const userLevel = req.user.level;
    const name = req.user.username;
    let prospeks;

    if (userLevel === "svp") {
      prospeks = await Prospek.find()
        .populate("salesId", "username level")
        .sort({ createdAt: -1 });
    } else {
      prospeks = await Prospek.find({ salesId })
        .populate("salesId", "username level")
        .sort({ createdAt: -1 });
    }

    const prospekWithFollowUpCount = prospeks.map((prospek) => {
      const obj = prospek.toJSON();
      obj.followUpCount = prospek.followUps.length;
      return obj;
    });

    logger.info(`Data prospek diambil untuk pengguna ${name}`);
    res.status(200).json(prospekWithFollowUpCount);
  } catch (error) {
    logger.error(`Kesalahan saat mengambil prospek: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.findProspekById = async (req, res) => {
  try {
    const salesId = req.user.id;
    const { id } = req.params;
    const userLevel = req.user.level;

    let foundProspek;

    if (userLevel === "svp") {
      foundProspek = await Prospek.findById(id).populate(
        "salesId",
        "username level"
      );
    } else {
      foundProspek = await Prospek.findOne({ _id: id, salesId });
    }

    if (!foundProspek) {
      logger.warn(`Prospek tidak ditemukan untuk id: ${id}`);
      return res.status(404).json({ message: "Prospek tidak ditemukan" });
    }

    logger.info(`Prospek ditemukan: ${JSON.stringify(foundProspek)}`);
    res.status(200).json(foundProspek);
  } catch (error) {
    logger.error(
      `Kesalahan saat mencari prospek berdasarkan id: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};

exports.updateProspek = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updatedProspek = await Prospek.findOneAndUpdate(
      { _id: id, salesId: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProspek) {
      logger.warn(`Prospek tidak ditemukan untuk diperbarui dengan id: ${id}`);
      return res.status(404).json({ message: "Prospek tidak ditemukan" });
    }

    logger.info(`Prospek diperbarui: ${JSON.stringify(updatedProspek)}`);
    res.status(200).json(updatedProspek);
  } catch (error) {
    logger.error(`Kesalahan saat memperbarui prospek: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProspek = async (req, res) => {
  try {
    const salesId = req.user.id;
    const { id } = req.params;

    const deletedProspek = await Prospek.findOneAndDelete({
      _id: id,
      salesId: salesId,
    });

    if (!deletedProspek) {
      logger.warn(`Prospek tidak ditemukan untuk dihapus dengan id: ${id}`);
      return res.status(404).json({ message: "Prospek tidak ditemukan" });
    }

    logger.info(`Prospek dihapus dengan id: ${id}`);
    res.status(204).json();
  } catch (error) {
    logger.error(`Kesalahan saat menghapus prospek: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// find Available prospek for spk
exports.findAvailableProspekForSpk = async (req, res) => {
  try {
    const useProspekIds = await SPK.find().distinct("prospekId");


    const availableProspek = await Prospek.find({
      _id: { $nin: useProspekIds },
    }).sort({ createdAt: -1 });


    res.status(200).json(availableProspek.map((p) => p.toJSON()));
  } catch (err) {
    
    res.status(500).json({
      message: "Gagal mengambil prospek yang tersedia",
      error: err.message,
    });
  }
};

// Follow Up
exports.getFollowUpById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, followUpId } = req.params;

    const prospek = await Prospek.findOne({ _id: id });

    if (
      !prospek ||
      (prospek.salesId.toString() !== userId && req.user.level !== "svp")
    ) {
      logger.warn("Prospek tidak ditemukan atau bukan milik user", {
        prospekId: id,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Prospek tidak ditemukan atau bukan milik Anda" });
    }

    const followUp = prospek.followUps.id(followUpId);

    if (!followUp) {
      logger.warn("Follow-up tidak ditemukan", {
        followUpId,
        prospekId: id,
        userId,
      });
      return res.status(404).json({ message: "Follow-up tidak ditemukan" });
    }

    logger.info("Follow-up berhasil ditemukan", {
      followUpId,
      prospekId: id,
      userId,
    });
    res.status(200).json({ message: "Follow-up ditemukan", data: followUp });
  } catch (error) {
    logger.error("Terjadi kesalahan saat mencari follow-up", {
      error: error.message,
    });
    res.status(500).json({
      message: "Terjadi kesalahan saat mencari follow-up",
      error: error.message,
    });
  }
};

exports.addFollowUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const sales = req.user.username;

    const { id } = req.params; // ID Prospek
    const {
      followUpDate,
      salesProces,
      interaction,
      note,
      customerResponse,
      recommendation,
    } = req.body;

    const prospek = await Prospek.findOne({
      _id: id,
      salesId: userId,
    });

    if (!prospek) {
      logger.warn("Prospek tidak ditemukan atau bukan milik user", {
        prospekId: id,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Prospek tidak ditemukan atau bukan milik Anda" });
    }

    // Menambahkan follow-up baru ke dalam array
    prospek.followUps.push({
      followUpDate,
      salesProces,
      interaction,
      note,
      customerResponse,
      recommendation,
    });
    await prospek.save();

    const spv = await User.findOne({ level: "svp" });
    if (spv) {
      console.log("Supervisor ditemukan:", spv.username);

      await Notification.create({
        recipientId: spv._id,
        level: "svp",
        title: "Follow-Up Baru oleh Sales",
        message: `Sales ${sales} melakukan follow-up untuk ${prospek.name}`,
        link: `detail/${prospek._id}`,
      });

      console.log("✅ Notifikasi untuk SPV berhasil dikirim.");
    }

    res
      .status(200)
      .json({ message: "Follow-up berhasil ditambahkan", data: prospek });
  } catch (error) {
    logger.error("Terjadi kesalahan saat menambahkan follow-up", {
      error: error.message,
    });
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan follow-up",
      error: error.message,
    });
  }
};

exports.updateFollowUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, followUpId } = req.params;
    const {
      followUpDate,
      salesProces,
      interaction,
      note,
      customerResponse,
      recommendation,
    } = req.body;

    const prospek = await Prospek.findOne({ _id: id });

    if (
      !prospek ||
      (prospek.salesId.toString() !== userId && req.user.level !== "svp")
    ) {
      logger.warn("Prospek tidak ditemukan atau bukan milik user", {
        prospekId: id,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Prospek tidak ditemukan atau bukan milik Anda" });
    }

    const followUp = prospek.followUps.id(followUpId);

    if (!followUp) {
      logger.warn("Follow-up tidak ditemukan", {
        followUpId,
        prospekId: id,
        userId,
      });
      return res.status(404).json({ message: "Follow-up tidak ditemukan" });
    }

    // Update data follow-up
    followUp.followUpDate = followUpDate || followUp.followUpDate;
    followUp.salesProces = salesProces || followUp.salesProces;
    followUp.interaction = interaction || followUp.interaction;
    followUp.note = note || followUp.note;
    followUp.customerResponse = customerResponse || followUp.customerResponse;
    followUp.recommendation = recommendation || followUp.recommendation;

    await prospek.save();
    logger.info("Follow-up berhasil diperbarui", {
      followUpId,
      prospekId: id,
      userId,
    });
    res
      .status(200)
      .json({ message: "Follow-up berhasil diperbarui", followUp });
  } catch (error) {
    logger.error("Terjadi kesalahan saat memperbarui follow-up", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

exports.deleteFollowUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, followUpId } = req.params;

    const prospek = await Prospek.findOne({ _id: id, salesId: userId });

    if (!prospek) {
      logger.warn("Prospek tidak ditemukan atau bukan milik user", {
        prospekId: id,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Prospek tidak ditemukan atau bukan milik Anda" });
    }

    const followUp = prospek.followUps.id(followUpId);
    if (!followUp) {
      logger.warn("Follow-up tidak ditemukan", {
        followUpId,
        prospekId: id,
        userId,
      });
      return res.status(404).json({ message: "Follow-up tidak ditemukan" });
    }

    // Hapus follow-up dari array
    followUp.deleteOne();
    await prospek.save();

    logger.info("Follow-up berhasil dihapus", {
      followUpId,
      prospekId: id,
      userId,
    });
    res.status(200).json({ message: "Follow-up berhasil dihapus" });
  } catch (error) {
    logger.error("Terjadi kesalahan saat menghapus follow-up", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};
