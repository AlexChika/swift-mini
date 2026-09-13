// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from "bullmq";
import { registerChatWorker } from "./workers/chat.workers";
import { registerMessageWorker } from "./workers/message.workers";

type Workers =
  | Worker<Swift.ChatJob["data"], unknown, Swift.ChatJob["name"]>
  | Worker<Swift.MessageJob["data"], unknown, Swift.MessageJob["name"]>;

const workers: Workers[] = [];

function initQueue() {
  const worker1 = registerChatWorker();
  const worker2 = registerMessageWorker();
  workers.push(worker1, worker2);
}

async function closeWorkers() {
  console.log(`Waiting for ${workers.length} workers to finish active jobs...`);
  await Promise.all(workers.map((worker) => worker.close()));
}

export { initQueue, closeWorkers };
