const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

const logFormat = format.combine(

  format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), 
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.File({ filename: "logs/app.log", level: "info" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/security.log", level: "warn" }),

    
    new transports.DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info", 
    }),

    // new transports.DailyRotateFile({
    //   filename: "logs/error-%DATE%.log",
    //   datePattern: "DD-MM-YYYY",
    //   zippedArchive: true,
    //   maxSize: "10m",
    //   maxFiles: "30d",
    //   level: "error",
    // }),
    
  ],
});

module.exports = logger;
