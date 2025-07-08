const db = require("../models");
const TestDrive = db.testDrive;
const Notification = db.notification;
const User = db.users;
const Prospek = db.prospek;
const logger = require("../utils/logger"); // Import logger

exports.createTestDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const salesName = req.user.username;
    const { prospekId, dateTestDrive, carType } = req.body;

    const existingTestDrive = await TestDrive.findOne({
      prospekId,
      salesId: userId,
    });

    if (existingTestDrive) {
      logger.warn(
        `Test drive sudah ada untuk prospekId: ${prospekId} oleh user: ${userId}`
      );
      return res.status(409).json({ message: "Test drive sudah ada" });
    }

    const newTestDrive = new TestDrive({
      salesId: userId,
      prospekId,
      dateTestDrive,
      carType,
    });

    const testDrive = await newTestDrive.save();
    await testDrive.populate("prospekId", "name");
    const svp = await User.findOne({ level: "svp" });

    if (svp) {
      await Notification.create({
        recipientId: svp._id,
        level: "svp",
        title: "Test-Drive Baru",
        message: `Sales ${salesName} Menjadwalkan Test-Drive untuk ${testDrive.prospekId.name}`,
      });
    }

    await Prospek.findByIdAndUpdate(prospekId, {
      status: "Test-Drive",
    });

    if (!db.mongoose.Types.ObjectId.isValid(prospekId)) {
      return res.status(400).json({ message: "ID prospek tidak valid" });
    }

    logger.info(`TestDrive berhasil ditambahkan oleh user: ${userId}`, {
      newTestDrive,
    });
    res.status(201).json({
      message: "Test-Drive berhasil ditambahkan",
      testDrive,
    });
  } catch (error) {
    logger.error(`Kesalahan saat menambahkan Test Drive: ${error.message}`);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan Test Drive",
      error: error.message,
    });
  }
};

exports.findAllTestDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const userLevel = req.user.level;

    let testDrives;
    if (userLevel === "svp") {
      testDrives = await TestDrive.find()
        .populate("salesId", "username")
        .populate("prospekId", "name whatsappNum")
        .sort({ createdAt: -1 });
    } else {
      testDrives = await TestDrive.find({ salesId: userId })
        .populate("salesId", "username")
        .populate("prospekId", "name whatsappNum")
        .sort({ createdAt: -1 });
    }

    logger.info(`Data Test Drive diambil oleh user: ${userId}`, {
      count: testDrives.length,
    });
    res.status(200).json(testDrives);
  } catch (error) {
    logger.error(`Kesalahan saat mengambil Test Drive: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.findTestDriveById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const testDrive = await TestDrive.findOne({
      _id: id,
      salesId: userId,
    }).populate("prospekId", "name whatsappNum");

    if (!testDrive) {
      logger.warn(
        `Data test drive tidak ditemukan untuk ID: ${id} oleh user: ${userId}`
      );
      return res
        .status(404)
        .json({ message: "Data test drive tidak ditemukan" });
    }
    logger.info(
      `Data test drive ditemukan untuk ID: ${id} oleh user: ${userId}`
    );
    res.status(200).json(testDrive);
  } catch (error) {
    logger.error(`Kesalahan saat mencari test drive: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTestDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updateTestDrive = await TestDrive.findOneAndUpdate(
      { _id: id, salesId: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updateTestDrive) {
      logger.warn(
        `Test drive tidak ditemukan untuk update ID: ${id} oleh user: ${userId}`
      );
      return res.status(404).json({ message: "Test drive tidak ditemukan" });
    }

    logger.info(
      `Test Drive berhasil diperbarui untuk ID: ${id} oleh user: ${userId}`,
      { updateTestDrive }
    );
    res.status(200).json({
      message: "Test Drive updated successfully",
      data: updateTestDrive,
    });
  } catch (error) {
    logger.error(`Kesalahan saat memperbarui test drive: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTestDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleteTestDrive = await TestDrive.findOneAndDelete({
      _id: id,
      salesId: userId,
    });

    if (!deleteTestDrive) {
      logger.warn(
        `Data Test Drive tidak ditemukan untuk dihapus ID: ${id} oleh user: ${userId}`
      );
      return res
        .status(404)
        .json({ message: "Data Test Drive tidak ditemukan" });
    }

    logger.info(
      `Test drive berhasil dihapus untuk ID: ${id} oleh user: ${userId}`
    );
    res.status(200).json({ message: "Test drive deleted successfully" });
  } catch (error) {
    logger.error(`Kesalahan saat menghapus test drive: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
