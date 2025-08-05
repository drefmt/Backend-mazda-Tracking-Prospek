const { getDateRange } = require('../utils/dateRange');
const db = require('../models');
const FeedbackLink = db.feedbackLink;
const logger = require('../utils/logger');
const moment = require('moment');

exports.feedback = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "month and year is required!" });
    }

    const { startDate, endDate } = getDateRange(month, year);
 const feedbacks = await FeedbackLink.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate({
        path: "retailId",
        select: "spkId salesId carType",
        populate: [
          {
            path: "salesId",
            select: "username", // 🟢 Tambahkan ini untuk ambil username
          },
          {
            path: "spkId",
            select: "prospekId",
            populate: {
              path: "prospekId",
              select: "name",
            },
          },
        ],
      })
      .populate("feedbackId")
      .sort({ createdAt: -1 });

    const periodFormatted = moment(startDate).format("MMMM YYYY");
    const generatedBy = req.user?.username || "Unknown";

    res.json({
      count: feedbacks.length,
      period: periodFormatted,
      generatedBy,
      data: feedbacks,
    });
  } catch (error) {
    logger.error("Failed to retrieve feedback report", error);
    res.status(500).json({
      message: "There was an error retrieving feedback report data.",
    });
  }
};
