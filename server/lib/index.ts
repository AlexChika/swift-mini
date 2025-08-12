import { Conversation } from "swift-mini";

function merge(
  base: Record<string, object>,
  ...items: Record<string, object>[]
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]; //item is an object;
    const inValidInput =
      typeof item !== "object" || Array.isArray(item) || item === null;

    if (inValidInput) continue;
    Object.keys(item).forEach((key) => {
      base[key] = { ...base[key], ...item[key] };
    });
  }

  return base;
}

function isUserAConversationParticipant(
  participants: Conversation["participants"],
  userId: string
) {
  return !!participants.find((p: { userId: string }) => p.userId === userId);
}

export { merge, isUserAConversationParticipant };
