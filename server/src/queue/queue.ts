import { registerChatWorker } from "./workers/chat.workers";

function initQueue() {
  registerChatWorker();
}

export { initQueue };
