const { getDateRange } = require('../utils/dateRange');
const db = require('../models');
const Prospek = db.prospek;
const moment = require('moment')


exports.reportProspek = async (req, res) => {
    try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "month and year is required" });
    }

    const { startDate, endDate } = getDateRange(month, year)

    // Query data prospek
    const prospeks = await Prospek.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("salesId", "username")
      

    
     const prospekWithFollowUpCount = prospeks.map((prospek) => {
      const obj = prospek.toJSON();
      obj.followUpCount = prospek.followUps.length;
      return obj;
    });

      const periodFormatted = moment(startDate).format("MMMM YYYY");
       const generatedBy = req.user?.username || "Unknown";

    res.json({
      count: prospeks.length,
      period: periodFormatted,       
      generatedBy,                   
      data: prospekWithFollowUpCount,
    });
  } catch (error) {
    console.error("Gagal ambil report prospek:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat ambil data report" });
  }
}