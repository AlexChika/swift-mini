import { Conversation } from "swift-mini";

function isUserAConversationParticipant(
  participants: Conversation["participants"],
  userId: string
) {
  return !!participants.find((p: { userId: string }) => p.userId === userId);
}

export default isUserAConversationParticipant;
