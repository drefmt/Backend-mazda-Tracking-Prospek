const { getDateRange } = require("../utils/dateRange");
const moment = require("moment")
const db = require("../models");
const logger = require('../utils/logger');
const Spk = db.spk;

exports.spkReports = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "month and year is required" });
    }

    const { startDate, endDate } = getDateRange(month, year); 

    const spk = await Spk.find({
      createdAt: {  
        $gte: startDate,
        $lte: endDate,
      }
    }).populate("salesId", "username").populate("prospekId", "name whatsappNum carType address");

    const periodFormatted = moment(startDate).format("MMMM YYYY");
    const generatedBy = req.user?.username || "Unknow"
    
    res.json({
      count: spk.length,
      period: periodFormatted,
      generatedBy,
      data: spk
    });
  } catch (error) {
    logger.error('Failed to retrieve spk reports', error);
    res.status(500).json({ message: "there was an error retrieve spk report data" });
  }
};
