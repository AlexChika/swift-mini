/* eslint-disable no-console */

import { CronJob } from "cron";
import http from "http";

const url = "https://server-swift-mini.devarise.tech";

const restartJob = CronJob.from({
  cronTime: "*/14 * * * *",
  onTick() {
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(res.statusMessage);
        console.log("Server restarted");
      } else console.error(`Server restart failed ${res.statusCode}`);
    });
  },
  start: false,
});

export default restartJob;
