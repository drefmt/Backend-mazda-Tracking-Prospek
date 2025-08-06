const { populate } = require("dotenv");
const db = require("../models/index");
const Retail = db.retail;
const Notification = db.notification;
const SPK = db.spk;
const User = db.users;
const Prospek = db.prospek;
const logger = require("../utils/logger");

// Create and Save a new Retail
exports.create = async (req, res) => {
  try {
    const salesId = req.user.id;
    const salesName = req.user.username;
    const { spkId, dateRetail, carType } = req.body;
    const newRetail = new Retail({
      salesId,
      spkId,
      dateRetail,      
      carType,
    });
    const retail = await newRetail.save();
    const spk = await SPK.findById(spkId) 

    await Prospek.findByIdAndUpdate(spk.prospekId, {
      status: 'Retail'
    })

    await SPK.findByIdAndUpdate(spkId, {
      status: "Delivered"
    })

    res.status(201).json({ message: "Retail berhasil ditambahkan", retail });
  } catch (err) {
    logger.error(`Error saat menambahkan Retail: ${err.message}`);
    res.status(500).json({
      message: err.message || "Terjadi kesalahan saat membuat Retail.",
    });
  }
};

// Retrieve all Retails from the database
exports.findAllRetail = async (req, res) => {
  try {
    const salesId = req.user.id;
    const userLevel = req.user.level;
    let retails;

    if (userLevel === "svp") {
      retails = await Retail.find()
        .populate("salesId", "username level")
        .populate({
          path: "spkId",
          select: "prospekId",
          populate: {
            path: "prospekId",
            select: "name",
          },
        })
        .sort({ createdAt: -1 });
    } else {
      retails = await Retail.find({ salesId })
        .populate("salesId", "username level")
        .populate({
          path: "spkId",
          select: "prospekId",
          populate: {
            path: "prospekId",
            select: "name",
          },
        })
        .sort({ createdAt: -1 });
    }

    logger.info(`Retail data diakses oleh user ${salesId}`);
    res.status(200).json(retails);
  } catch (err) {
    logger.error(`Error saat mengambil data Retail: ${err.message}`);
    res.status(500).json({
      message: err.message || "Terjadi kesalahan saat mengambil Retail.",
    });
  }
};

// Find a single Retail with an id
exports.findRetailById = async (req, res) => {
  const { id } = req.params;
  const salesId = req.user.id;
  try {
    const retail = await Retail.findOne({ _id: id, salesId }).populate({
      path: "spkId",
      select: "prospekId",
      populate: {
        path: "prospekId",
        select: "name",
      },
    });

    if (!retail) {
      logger.warn(
        `Retail dengan ID ${id} tidak ditemukan oleh user ${salesId}`
      );
      return res.status(404).json({ message: "Retail tidak ditemukan" });
    }
    res.status(200).json(retail);
  } catch (err) {
    logger.error(`Error saat mencari Retail dengan ID ${id}: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Update a Retail by the id in the request
exports.updateRetail = async (req, res) => {
  try {
    const { id } = req.params;
    const salesId = req.user.id;
    const updatedRetail = await Retail.findOneAndUpdate(
      { _id: id, salesId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRetail) {
      logger.warn(
        `Retail dengan ID ${id} tidak ditemukan oleh user ${salesId}`
      );
      return res.status(404).json({ message: "Retail tidak ditemukan" });
    }
    res.status(200).json(updatedRetail);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui Retail." });
  }
};

// Delete a Retail with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const salesId = req.user.id;
    const retail = await Retail.findOneAndDelete({ _id: id, salesId });

    if (!retail) {
      logger.warn(
        `Retail dengan ID ${id} tidak ditemukan oleh user ${salesId}`
      );
      return res.status(404).json({ message: "Retail tidak ditemukan" });
    }
    res.json({ message: "Retail berhasil dihapus" });
  } catch (err) {
    logger.error(`Error saat menghapus Retail dengan ${err.message}`);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus Retail." });
  }
};
