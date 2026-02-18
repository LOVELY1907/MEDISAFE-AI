const cron = require("node-cron");
const Tablet = require("./models/Tablet");

cron.schedule("* * * * *", async () => {
  const now = new Date().toTimeString().slice(0,5);

  const tablets = await Tablet.findAll({
    where: { reminderTime: now }
  });

  tablets.forEach(t =>
    console.log(`Reminder: Take ${t.tabletName}`)
  );
});
