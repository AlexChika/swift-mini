import SwiftStore from "@/store/Store";
import { useMemo, useState } from "react";

export function useRecentGroups() {
  const { allChats } = SwiftStore();
  const [chats] = useState<ChatLean[]>(allChats);

  const recentGroups = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return chats
      .filter(
        (chat) =>
          new Date(chat.updatedAt) > oneMonthAgo && chat.chatType == "group"
      )
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, 20);
  }, [chats]);

  return recentGroups;
}
