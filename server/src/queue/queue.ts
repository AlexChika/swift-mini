import { registerChatWorker } from "./workers/chat.workers";
import { registerMessageWorker } from "./workers/message.workers";

function initQueue() {
  registerChatWorker();
  registerMessageWorker();
}

export { initQueue };
