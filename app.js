const express = require("express");
require("dotenv").config();
// const cookieParser = require('cookie-parser');

const logger = require('./app/utils/logger')


// NOTIFICATION FEATURES
const  runReminderJob = require('./app/utils/reminderJob');
runReminderJob()


const app = express();
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    // res.setHeader("Access-Control-Allow-Origin", "http://192.168.165.239:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
  
const usersRoute = require('./app/routes/Users.routes');
const prospekRoutes = require('./app/routes/prospek.routes');
const spkRoutes = require('./app/routes/spk.routes');
const testDriveRoutes = require('./app/routes/testDrive.routes');
const retailRoutes = require('./app/routes/retail.routes');
const notification = require('./app/routes/notification.routes');


app.use('/api/users', usersRoute);
app.use('/api/prospek', prospekRoutes);
app.use('/api/spk', spkRoutes);
app.use('/api/test-drive', testDriveRoutes);
app.use('/api/retail', retailRoutes);
app.use('/api/notification/prospect-reminder', notification);

app.use((err, req, res, next) => {
  logger.error(`🚨 Error terjadi: ${err.message}`);
  res.status(500).json({ error: "Terjadi kesalahan di server" });
});

module.exports = app;
