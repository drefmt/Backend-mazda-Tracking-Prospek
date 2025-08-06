const schedule = require("node-schedule");
const db = require("../models");
const Prospek = db.prospek;

const Notification = db.notification;
const logger = require("./logger");

const runReminderJob = () => {
  schedule.scheduleJob("0 7 * * *", async () => {
    console.log("CRON JOB JALAN");

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
 
    const prospek = await Prospek.find({
      status: { $in:  ['Prospek','Test-Drive','SPK'] },
      followUps: {
        $elemMatch: {
          followUpDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
    }).populate("salesId");

    console.log(`[CRON] Jumlah prospect ditemukan: ${prospek.length}`);

    for (const p of prospek) {
      const userRole = p.salesId.level;  
      const existingNotif = await Notification.findOne({
        recipientId: p.salesId._id,
        level: "sales",
        title: `Jangan lupa follow-up ${p.name}!`,
        message: `${p.name} sedang menunggu kabar dari Anda hari ini.`,
         link: `/${userRole}/prospek/detail/${p._id}`,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      if (!existingNotif) {
        await Notification.create({
          recipientId: p.salesId._id,
          level: "sales",
          title: `Jangan lupa follow-up ${p.name}!`,
          message: `${p.name} sedang menunggu kabar dari Anda hari ini.`,
          link: `/${userRole}/prospek/detail/${p._id}`,
        });

        logger.info(
          `[Reminder] Notifikasi follow-up untuk ${p.name} dikirim ke ${p.salesId.username}`
        );
      }
    }
  });
};

module.exports = runReminderJob;
