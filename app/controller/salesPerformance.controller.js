const db = require("../models");
const { getDateRange } = require("../utils/dateRange");

const User = db.users;
const Prospek = db.prospek;
const TestDrive = db.testDrive;
const Spk = db.spk;
const Retail = db.retail;

exports.reportSalesPerformance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!month || !year) {
       return res.status(400).json({ message: "Month and year are required." });
    }

    const { startDate, endDate } = getDateRange(month, year);

    const salesList = await User.find({ level: 'sales' });

    const report = [];

    for (const sales of salesList) {
        const salesId = sales.id;

        const [prospek, testDrive, spk, retail] = await Promise.all([
            Prospek.countDocuments({ salesId, createdAt:{ $gte: startDate, $lte: endDate } }),
            TestDrive.countDocuments({ salesId, createdAt:{ $gte: startDate, $lte: endDate } }),
            Spk.countDocuments({ salesId, createdAt:{ $gte: startDate, $lte: endDate } }),
            Retail.countDocuments({ salesId, createdAt:{ $gte: startDate, $lte: endDate } }),

        ]);

        const leadConvertion = prospek > 0 ? (testDrive / prospek) * 100 : 0;
        const spkConvertion = prospek > 0 ? (spk / prospek) * 100 : 0;
        const retailConvertion = prospek > 0 ? (retail / prospek) * 100 : 0;

        report.push({
        salesName: sales.username,
        totalProspek: prospek,
        totalTestDrive: testDrive,
        totalSpk: spk,
        totalRetail: retail,
        konversiTestDrive: leadConvertion.toFixed(2) + "%",
        konversiSpk: spkConvertion.toFixed(2) + "%",
        konversiRetail: retailConvertion.toFixed(2) + "%",
      });
    }
    res.json({
      count: report.length,
      data: report,
      monthNum,
      yearNum,
    });

    }
   catch (error) {
    console.error("Gagal ambil laporan kinerja sales:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat ambil laporan kinerja sales" });
  }
  
};
