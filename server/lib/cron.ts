import axios, { type AxiosError } from "axios";
import { CronJob } from "cron";

const url = "https://server-swiftmini.globalstack.dev/health";

const tryPing = async (attempt = 1) => {
  try {
    await axios.get(url, { timeout: 5000 });
    console.log("Keepalive ping successful");
  } catch (err) {
    if (attempt < 2) {
      console.warn("Retrying ping...");
      setTimeout(() => tryPing(attempt + 1), 1000); // retry after 1s
    } else {
      const e = err as unknown as AxiosError;
      console.error("Final ping attempt failed:", e.message);
    }
  }
};

const keepAliveJob = CronJob.from({
  cronTime: "*/13 * * * *",
  onTick() {
    tryPing();
  },
  start: false
});

export default keepAliveJob;
