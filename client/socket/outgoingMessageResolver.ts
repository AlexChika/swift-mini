import { getRandomId } from "../lib/helpers";
import { socketEmitNewMessage } from "./socket";

class OutgoingMessageResolver {
  #pendingQueue: Record<string, OutboundMessage> = {};
  // #retryList: Record<string, { message: unknown; retries: number }>[] = [];
  // #maxRetries: number = 3;
  // #retryInterval: number = 3000; // 1 second
  // #failedList: Record<string, unknown>[] = [];

  enqueueMessage(message: SendMessage) {
    const tempId = getRandomId({ type: "alphaNumeric" });
    const outboundMessage: OutboundMessage = {
      tempId,
      message,
      type: "outbound",
      status: "pending",
      chatId: message.chatId
    };

    this.#pendingQueue[tempId] = outboundMessage;
    socketEmitNewMessage({
      tempId,
      message
    });

    return tempId;
  }

  enqueueAck(payload: Swift.Events["MESSAGE_CREATED_ACK"]) {
    console.log({ payload });
  }
}

export const outgoingMessageResolver = new OutgoingMessageResolver();
