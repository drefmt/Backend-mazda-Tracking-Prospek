const dayjs = require('dayjs')

exports.getDateRange = (month, year) => {
  const m = parseInt(month);
  const y = parseInt(year);

  if (!m || !y || m < 1 || m > 12) {
    throw new Error("Bulan dan tahun tidak valid");
  }

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

 exports.getCurrentMonthRange = () => {
  const startDate = dayjs().startOf("month").toDate();
  const endDate = dayjs().endOf("month").toDate();
  return { startDate, endDate };
}

exports.getYearRange = (year) => {
  const y = parseInt(year);
  if (!y || y < 2000 || y > 2100) {
    throw new Error("Invalid year");
  }

  const startDate = new Date(y, 0, 1, 0, 0, 0, 0); 
  const endDate = new Date(y, 11, 31, 23, 59, 59, 999);

  return { startDate, endDate };
};


exports.getMonthRangeByString = (monthStr) => {
  const startDate = dayjs(monthStr + "-01").startOf("month").toDate();
  const endDate = dayjs(monthStr + "-01").endOf("month").toDate();
  return { startDate, endDate };
}



exports.getMonthName = (monthIndex) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex] || "-";
};


// module.exports = { getDateRange };
