// @ts-nocheck
const logger = require("../utils/logger");
const db = require("../models");
const Prospek = db.prospek;
const { getDateRange } = require("../utils/dateRange");

exports.reportFollowUp = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Bulan dan tahun wajib diisi" });
    }

    const { startDate, endDate } = getDateRange(month, year);

    const prospeks = await Prospek.find({
      followUps: { $exists: true, $ne: [] },
    }).populate("salesId", "username");

    const report = [];

    for (const prospek of prospeks) {
      const { name, salesId, followUps } = prospek;

      const filteredFollowUps = followUps.filter(
        (fu) => fu.followUpDate >= startDate && fu.followUpDate <= endDate
      );

      if (filteredFollowUps.length === 0) continue;


      const sorted = filteredFollowUps.sort(
        (a, b) => new Date(b.followUpDate) - new Date(a.followUpDate)
      );

      const lastFollowUp = sorted[0];
      report.push({
        name,
        salesName: salesId?.username || "-",
        totalFollowUp: filteredFollowUps.length,
        lastFollowUpStatus: lastFollowUp.customerResponse || "-",
        lastFollowUpDate: lastFollowUp.followUpDate,
      });
    }
    res.json({
      count: report.length,
      data: report,
    });
  } catch (error) {
    logger.error("Gagal ambil laporan ringkasan follow-up:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat ambil data laporan follow-up" });
  }
};
