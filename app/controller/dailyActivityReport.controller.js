const { getDateRange } = require('../utils/dateRange');
const db = require('../models');
const logger = require('../utils/logger');
const moment = require('moment');

const DailyActivity = db.dailyActivity;

exports.reportDailyActivity = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required!' });
    }

    const { startDate, endDate } = getDateRange(month, year);

    const activities = await DailyActivity.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('salesId', 'username');

    const periodFormatted = moment(startDate).format("MMMM YYYY");
    const generatedBy = req.user?.username || "Unknown";

    res.json({
      count: activities.length,
      period: periodFormatted,
      generatedBy,
      data: activities,
    });
  } catch (error) {
    logger.error('Failed to retrieve daily activity report:', error);
    res.status(500).json({ message: 'There was an error retrieving the daily activity report data.' });
  }
};
