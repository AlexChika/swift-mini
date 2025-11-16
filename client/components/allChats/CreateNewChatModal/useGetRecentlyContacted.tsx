import SwiftStore from "@/store/swiftStore";
import { useMemo, useState } from "react";
import { extractUniqueMembers } from "./SearchUsersPane/SearchUsersContactsPane";
import { useSession } from "next-auth/react";

export function useGetRecentlyContacted() {
  const { allChats } = SwiftStore();
  const session = useSession().data;
  const userId = session?.user?.id;

  const [chats] = useState<ChatLean[]>(allChats); // storing allChats in a state bring stabilization. AllChats changes constatntle even for just metadas. This recent list also doen't eed to be realtime..

  const recentlyContacted = useMemo(() => {
    if (!userId) return [];

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentChats = chats
      .filter(
        (chat) =>
          new Date(chat.updatedAt) > oneMonthAgo && chat.chatType == "duo"
      )
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, 20);

    return extractUniqueMembers(recentChats, userId);
  }, [chats, userId]);

  return recentlyContacted;
}
