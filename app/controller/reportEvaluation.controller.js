const db = require("../models");
const { getYearRange, getMonthName } = require("../utils/dateRange");

const Prospek = db.prospek;
const TestDrive = db.testDrive;
const Spk = db.spk;
const Retail = db.retail;

exports.getEvaluationReport = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    const { startDate, endDate } = getYearRange(year);

    const [prospectCount, testDriveCount, spkCount, retailCount] = await Promise.all([
      Prospek.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      TestDrive.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Spk.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Retail.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    ]);

    const calculateRatio = (value, total) =>
      total > 0 ? ((value / total) * 100).toFixed(2) + "%" : "0.00%";

    const evaluationReport = {
      period: `January - December ${year}`,
      totalProspects: prospectCount,
      totalTestDrives: testDriveCount,
      totalSpks: spkCount,
      totalRetails: retailCount,
      testDriveConversion: calculateRatio(testDriveCount, prospectCount),
      spkConversion: calculateRatio(spkCount, prospectCount),
      retailConversion: calculateRatio(retailCount, prospectCount),
    };

    res.status(200).json(evaluationReport);

  } catch (error) {
    console.error("Failed to generate annual sales evaluation report:", error);
    res.status(500).json({ message: "An error occurred while retrieving the sales evaluation report." });
  }
};


exports.getSalesEvaluationReport = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    const y = parseInt(year);
    if (isNaN(y) || y < 2000 || y > 2100) {
      return res.status(400).json({ message: "Invalid year." });
    }

    const result = [];

    for (let m = 0; m < 12; m++) {
      const startDate = new Date(y, m, 1, 0, 0, 0, 0);
      const endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);

      const [prospectCount, testDriveCount, spkCount, retailCount] = await Promise.all([
        Prospek.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
        TestDrive.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
        Spk.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
        Retail.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      ]);

      // Skip if there's no data in this month
      const hasData = prospectCount > 0 || testDriveCount > 0 || spkCount > 0 || retailCount > 0;
      if (!hasData) continue;

      const calculateRatio = (value, total) =>
        total > 0 ? ((value / total) * 100).toFixed(2) + "%" : "0.00%";

      result.push({
        month: getMonthName(m),
        totalProspects: prospectCount,
        totalTestDrives: testDriveCount,
        totalSpks: spkCount,
        totalRetails: retailCount,
        testDriveConversion: calculateRatio(testDriveCount, prospectCount),
        spkConversion: calculateRatio(spkCount, prospectCount),
        retailConversion: calculateRatio(retailCount, prospectCount),
      });
    }

    res.status(200).json({
      period: y,
      data: result,
    });

  } catch (error) {
    console.error("Failed to generate monthly sales evaluation report:", error);
    res.status(500).json({
      message: "An error occurred while generating the sales evaluation report.",
    });
  }
};