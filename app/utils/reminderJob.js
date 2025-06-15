const schedule = require("node-schedule");
const db = require("../models");
const Prospect = db.prospek;
const Notification = db.notification;
const logger = require("./logger");

const runReminderJob = () => {
  schedule.scheduleJob("* * * * *", async () => {
    const today = new Date().toISOString().split("T")[0];

    const prospects = await Prospect.find({
      status: { $in: ["Prospek", "TestDrive", "SPK"] },
      followUps: {
        $elemMatch: {
          followUpDate: {
            $gte: new Date(`${today}T00:00:00Z`),
            $lte: new Date(`${today}T23:59:59Z`),
          },
        },
      },
    }).populate("salesId");

    for (const prospect of prospects) {
      const existingNotif = await Notification.findOne({
        recipientId: prospect.salesId._id,
        level: "sales",
        message: `Hari ini follow-up ${prospect.name}`,
        createdAt: {
          $gte: new Date(`${today}T00:00:00Z`),
          $lte: new Date(`${today}T23:59:59Z`),
        },
      });

      if (!existingNotif) {
        await Notification.create({
          recipientId: prospect.salesId._id,
          level: "sales",
          title: "Reminder Follow-up",
          message: `Hari ini follow-up ${prospect.name}`,
          link: `/prospek/${prospect._id}`,
        });

        logger.info(
          `[Reminder] Notifikasi follow-up untuk ${prospect.name} dikirim ke ${prospect.salesId.username} (${today})`
        );
      }
    }
  });
};

module.exports = runReminderJob;
