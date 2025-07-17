const db = require("../models");
const dayjs = require("dayjs");
const Prospek = db.prospek;
const SPK = db.spk;
const TestDrive = db.testDrive;

const Retail = db.retail;
const {
  getCurrentMonthRange,
  getMonthRangeByString,
} = require("../utils/dateRange");

async function getDashboardSummary(user) {
  const { startDate, endDate } = getCurrentMonthRange();

  const matchCondition = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (user.role === "sales") {
    matchCondition.salesId = user._id;
  }

  const [totalProspek, totalTestDrive, totalSPK, totalRetail, totalFollowUp] =
    await Promise.all([
      Prospek.countDocuments(matchCondition),
      TestDrive.countDocuments(matchCondition),
      SPK.countDocuments(matchCondition),
      Retail.countDocuments(matchCondition),
      Prospek.aggregate([
        { $match: matchCondition },
        { $project: { followUpsCount: { $size: "$followUps" } } },
        { $group: { _id: null, total: { $sum: "$followUpsCount" } } },
      ]),
    ]);

  const followUpCount = totalFollowUp[0]?.total || 0;
  const conversionRate =
    totalProspek > 0 ? (totalRetail / totalProspek) * 100 : 0;

  return {
    totalProspek,
    totalTestDrive,
    totalSPK,
    totalRetail,
    followUpCount,
    conversionRate: conversionRate.toFixed(1),
  };
}

async function getConversionFunnel(month, user) {
  const { startDate, endDate } = month
    ? getMonthRangeByString(month)
    : getCurrentMonthRange();

  const match = { createdAt: { $gte: startDate, $lte: endDate } };
  if (user.role === "sales") match.salesId = user._id;

  const [prospek, testDrive, spk, retail] = await Promise.all([
    Prospek.countDocuments(match),
    TestDrive.countDocuments(match),
    SPK.countDocuments(match),
    Retail.countDocuments(match),
  ]);

  return { prospek, testDrive, spk, retail };
}

function getDailyCountPipeline(match) {
  return [
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ];
}

async function getDailyActivityByYear(year, user) {
  const startDate = dayjs(`${year}-01-01`).startOf("day").toDate();
  const endDate = dayjs(`${year}-12-31`).endOf("day").toDate();

  const match = { createdAt: { $gte: startDate, $lte: endDate } };
  if (user.role === "sales") match.salesId = user._id;

  const [prospekAgg, testDriveAgg, spkAgg, retailAgg] = await Promise.all([
    Prospek.aggregate(getDailyCountPipeline(match)),
    TestDrive.aggregate(getDailyCountPipeline(match)),
    SPK.aggregate(getDailyCountPipeline(match)),
    Retail.aggregate(getDailyCountPipeline(match)),
  ]);

  // Gabungkan berdasarkan tanggal
  const activityMap = new Map();

  for (const item of prospekAgg) {
    if (!activityMap.has(item._id)) activityMap.set(item._id, {});
    activityMap.get(item._id).prospek = item.count;
  }

  for (const item of testDriveAgg) {
    if (!activityMap.has(item._id)) activityMap.set(item._id, {});
    activityMap.get(item._id).testDrive = item.count;
  }

  for (const item of spkAgg) {
    if (!activityMap.has(item._id)) activityMap.set(item._id, {});
    activityMap.get(item._id).spk = item.count;
  }

  for (const item of retailAgg) {
    if (!activityMap.has(item._id)) activityMap.set(item._id, {});
    activityMap.get(item._id).retail = item.count;
  }

  // Buat array chartData tanpa tanggal yang kosong
  const chartData = Array.from(activityMap.entries()).map(([date, data]) => ({
    date,
    prospek: data.prospek || 0,
    testDrive: data.testDrive || 0,
    spk: data.spk || 0,
    retail: data.retail || 0,
  }));

  // Summary
  const summary = {
    prospek: prospekAgg.reduce((sum, item) => sum + item.count, 0),
    testDrive: testDriveAgg.reduce((sum, item) => sum + item.count, 0),
    spk: spkAgg.reduce((sum, item) => sum + item.count, 0),
    retail: retailAgg.reduce((sum, item) => sum + item.count, 0),
  };

  return { summary, chartData };
}

async function getTopSalesByRetail(month, limit = 5) {
  const { startDate, endDate } = month
    ? getMonthRangeByString(month)
    : getCurrentMonthRange();

  const salesRetailAgg = await Retail.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: "$salesId",
        totalRetail: { $sum: 1 },
      },
    },
    {
      $sort: { totalRetail: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "sales",
      },
    },
    {
      $unwind: "$sales",
    },
    {
      $project: {
        _id: 0,
        salesId: "$sales._id",
        name: "$sales.username",
        totalRetail: 1,
      },
    },
  ]);

  return salesRetailAgg;
}

module.exports = {
  getDashboardSummary,
  getConversionFunnel,
  getDailyActivityByYear,
  getTopSalesByRetail,
};
