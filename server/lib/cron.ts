/* eslint-disable no-console */

import { CronJob } from "cron";
import https from "https";

const url = "https://server-swiftmini.globalstack.dev/cron";

const restartJob = CronJob.from({
  cronTime: "*/14 * * * *",
  onTick() {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(res.statusMessage);
        console.log("Server restarted");
      } else console.error(`Server restart failed ${res.statusCode}`);
    });
  },
  start: false,
});

export default restartJob;
