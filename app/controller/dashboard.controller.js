const { getDashboardSummary, getConversionFunnel, getDailyActivityByYear, getTopSalesByRetail } = require('../service/dashboard.service')

exports.getSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.user);
    res.json(summary);
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Gagal mengambil ringkasan dashboard." });
  }
}

exports.getConversion = async (req, res) => {
  try {
    const { month } = req.query; // contoh: '2025-07'
    const result = await getConversionFunnel(month, req.user);
    res.json(result);
  } catch (err) {
    console.error("Error fetching conversion funnel:", err);
    res.status(500).json({ message: "Gagal mengambil data konversi." });
  }
}

exports.getYearlyActivity = async(req, res) =>  {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await getDailyActivityByYear(year, req.user);
    res.json(data);
  } catch (err) {
    console.error("Yearly activity error:", err);
    res.status(500).json({ message: "Gagal mengambil data tahunan." });
  }
}

 exports.getTopPerformers = async(req, res) => {
  try {
    const { month, limit } = req.query; // month: '2025-07'
    const data = await getTopSalesByRetail(month, parseInt(limit) || 5);
    res.json(data);
  } catch (err) {
    console.error("Top performers error:", err);
    res.status(500).json({ message: "Gagal mengambil data kinerja sales." });
  }
}