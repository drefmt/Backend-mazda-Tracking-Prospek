const express = require("express");
require("dotenv").config();
const cors = require("cors");

const logger = require("./app/utils/logger");

// NOTIFICATION FEATURES
const runReminderJob = require("./app/utils/reminderJob");
runReminderJob();

const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({ origin: "http://192.168.18.36:5173", credentials: true }));

app.use(express.urlencoded({ extended: true }));

const usersRoute = require("./app/routes/Users.routes");
const prospekRoutes = require("./app/routes/prospek.routes");
const spkRoutes = require("./app/routes/spk.routes");
const testDriveRoutes = require("./app/routes/testDrive.routes");
const retailRoutes = require("./app/routes/retail.routes");
const dailyActivity = require("./app/routes/dailyActivity.routes");
const notificationRoutes = require("./app/routes/notification.routes");
const dashboardRoutes = require("./app/routes/dashboard.routes");
const feedback = require("./app/routes/feedback.routes");

// Report Routes
const reportRoutes = require("./app/routes/report.routes");

app.use("/api/users", usersRoute);
app.use("/api/prospek", prospekRoutes);
app.use("/api/spk", spkRoutes);
app.use("/api/test-drive", testDriveRoutes);
app.use("/api/retail", retailRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity", dailyActivity);
app.use("/api/feedback", feedback);

// report
app.use("/api/report", reportRoutes);

app.use((err, req, res, next) => {
  logger.error(`🚨 Error terjadi: ${err.message}`);
  res.status(500).json({ error: "Terjadi kesalahan di server" });
  next();
});

module.exports = app;
