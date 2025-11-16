import SwiftStore from "@/store/swiftStore";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client/react";
import userOps from "@/graphql/operations/user.ops";
import { extractUniqueMembers } from "./SearchUsersPane/SearchUsersContactsPane";

type GetRandomUsersVariable = {
  count?: number;
};

type GetRandomUsersData = {
  getRecentRandomUsers: ApiReturn<UserLean[], "users">;
};

export function useGetSwiftUsers(count?: number) {
  const { allChats } = SwiftStore();
  const session = useSession().data;
  const userId = session?.user?.id;
  const [chats] = useState<ChatLean[]>(allChats); // storing allChats in a state brings stabilization. AllChats changes constatntly even for just metadas. This recent list also doen't need to be realtime..

  const { data, loading } = useQuery<
    GetRandomUsersData,
    GetRandomUsersVariable
  >(userOps.Queries.getRecentRandomUsers, {
    variables: { count },
    fetchPolicy: "cache-and-network"
  });

  const swiftUsers = useMemo(() => {
    if (!userId) return [];

    const users = data?.getRecentRandomUsers?.success
      ? data.getRecentRandomUsers.users
      : [];

    const existingUsers = extractUniqueMembers(chats, userId);

    const existingIds = new Set(existingUsers.map((u) => u.id));

    return users.filter((u) => !existingIds.has(u.id));
  }, [userId, chats, data]);

  return { swiftUsers, loading };
}
