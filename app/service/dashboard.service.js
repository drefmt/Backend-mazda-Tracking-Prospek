const db = require("../models");
const dayjs = require("dayjs");
const { ObjectId } = require("mongodb");
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

  // Filter untuk prospek
  const prospekMatch = {
    createdAt: { $gte: startDate, $lte: endDate }
  };

  // Filter untuk test drive
  const testDriveMatch = {
    dateTestDrive: { $gte: startDate, $lte: endDate }
  };

  // Filter untuk SPK
  const spkMatch = {
    dateSpk: { $gte: startDate, $lte: endDate }
  };

  // Filter untuk retail
  const retailMatch = {
    dateRetail: { $gte: startDate, $lte: endDate }
  };

  // Filter role sales
  if (user.level === "sales") {
    const salesId = new ObjectId(user._id || user.id);
    prospekMatch.salesId = salesId;
    testDriveMatch.salesId = salesId;
    spkMatch.salesId = salesId;
    retailMatch.salesId = salesId;
  }

  const [totalProspek, totalTestDrive, totalSPK, totalRetail, totalFollowUp] =
    await Promise.all([
      Prospek.countDocuments(prospekMatch),
      TestDrive.countDocuments(testDriveMatch),
      SPK.countDocuments(spkMatch),
      Retail.countDocuments(retailMatch),
      Prospek.aggregate([
        { $match: prospekMatch },
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

function getDailyCountPipeline(match, dateField = "createdAt") {
  return [
    { $match: match },
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } }
      }
    },
    { $group: { _id: "$date", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];
}


async function getDailyActivityByYear(year, user) {
  const startDate = dayjs(`${year}-01-01`).startOf("day").toDate();
  const endDate = dayjs(`${year}-12-31`).endOf("day").toDate();

  const baseSalesMatch = {};
  if (user.level === "sales") {
    baseSalesMatch.salesId = new ObjectId(user.id);
  }

  const [prospekAgg, testDriveAgg, spkAgg, retailAgg] = await Promise.all([
    Prospek.aggregate(
      getDailyCountPipeline({
        ...baseSalesMatch,
        createdAt: { $gte: startDate, $lte: endDate }
      })
    ),
    TestDrive.aggregate(
      getDailyCountPipeline({
        ...baseSalesMatch,
        dateTestDrive: { $gte: startDate, $lte: endDate }
      })
    ),
    SPK.aggregate(
      getDailyCountPipeline({
        ...baseSalesMatch,
        dateSpk: { $gte: startDate, $lte: endDate }
      })
    ),
    Retail.aggregate(
      getDailyCountPipeline({
        ...baseSalesMatch,
        dateRetail: { $gte: startDate, $lte: endDate }
      })
    )
  ]);

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

  const chartData = Array.from(activityMap.entries()).map(([date, data]) => ({
    date,
    prospek: data.prospek || 0,
    testDrive: data.testDrive || 0,
    spk: data.spk || 0,
    retail: data.retail || 0,
  }));

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
