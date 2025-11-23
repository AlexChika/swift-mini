import { Session } from "next-auth";
import UsersList from "../UsersList";
import SwiftStore from "@/store/swiftStore";
import { useSession } from "next-auth/react";
import { debounce, toRems } from "@/lib/helpers";
import useNavigate from "@/lib/hooks/useNavigate";
import CategorizedUsers from "./CategorizedUsers";
import { useCallback, useMemo, useState } from "react";
import { Box, Text, Input, Center, HStack } from "@chakra-ui/react";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "user" | "group";
};

function SearchUsersContactsPane({ type, setIsOpen }: Props) {
  const { allChats } = SwiftStore();
  const { openChat } = useNavigate();
  const session = useSession().data as Session;

  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState<User[] | ChatLean[]>([]);

  const [lists] = useState(() => {
    if (type === "group") return extractGroups(allChats);
    else return extractUniqueMembers(allChats, session.user.id);
  });

  const _searchUsers = useCallback(
    function (username: string) {
      const res =
        type == "group"
          ? (lists as ChatLean[]).filter((chat) =>
              chat.chatName?.toLowerCase().includes(username)
            )
          : (lists as User[]).filter((user) =>
              user.username?.toLowerCase().includes(username)
            );
      setSearchedUser(res);
    },

    [lists, type]
  );

  const searchUsers = useMemo(() => {
    return debounce(_searchUsers, 300);
  }, [_searchUsers]); // thottled

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    let username = e.target.value;
    setUsername(username);

    username = username.trim().toLowerCase();
    if (!username) username = "(<<__SWIFT_??_EMPTY__>>)";

    searchUsers(username);
  }

  const handleClick = useCallback(
    (id: string, opts?: { chatId?: string }) => {
      openChat(type == "group" ? id : opts?.chatId || "");
      setIsOpen(false);
    },
    [openChat, setIsOpen, type]
  );

  const customProps = useMemo(() => {
    if (type == "group") {
      return {
        type: "group" as const,
        groupList: searchedUser as ChatLean[],
        onClick: handleClick
      };
    } else {
      return {
        type: "user" as const,
        userList: searchedUser as User[],
        onClick: handleClick
      };
    }
  }, [searchedUser, type, handleClick]);

  return (
    <Box h="calc(100% - 3.75rem)">
      <Input
        value={username}
        borderRadius={6}
        autoComplete="off"
        onChange={handleSearch}
        name="search users"
        placeholder={
          type == "group"
            ? "Type a group name to search"
            : "Type a username to search"
        }
      />

      {/* body of search  pane */}
      <Box
        mt={5}
        overflowY="scroll"
        h="calc(100% - 4rem)"
        scrollbarWidth="none">
        <HStack
          pt={2}
          pb={1}
          maxW="95%"
          wrap="nowrap"
          color="gray.400"
          _dark={{ color: "gray.600" }}
          justify="space-between">
          <Text whiteSpace="nowrap">
            {type == "group"
              ? "Group search results"
              : "Contact list search results"}
          </Text>

          <Text> - </Text>

          <Text as="span" truncate px={1} bg="{colors.primaryBg/20}">
            Search for{" "}
            <Text as="span" opacity={0.6} color="{colors.primaryText}">
              {username || "none"}
            </Text>
          </Text>
        </HStack>

        {/* userlist from search*/}
        <UsersList
          mt={1}
          scrollbarWidth="1px"
          customProps={customProps}
          bg="{colors.primaryBg/15}"
          maxH={`calc(100% - ${toRems(130)})`}
        />

        {/* users contact list*/}
        <Box mt={10}>
          <Text
            mb={3}
            display="flex"
            color="gray.400"
            _dark={{ color: "gray.600" }}
            justifyContent="space-between">
            <Text as="span">
              {type == "group" ? "Group chats" : "Your swift contacts"}
            </Text>
            <Text as="span">
              {lists.length} {type == "group" ? "groups" : "contacts"}
            </Text>
          </Text>

          {type == "user" && (
            <CategorizedUsers
              type="user"
              userClick={handleClick}
              list={lists as User[]}
            />
          )}

          {type == "group" && (
            <CategorizedUsers
              type="group"
              userClick={handleClick}
              list={lists as ChatLean[]}
            />
          )}

          {lists.length < 1 && (
            <Center
              mt={2}
              h="9rem"
              flexDir="column"
              color="gray.500"
              border="1px dashed">
              <Text>
                {type == "group"
                  ? "You are yet to join any groups"
                  : "You are yet to add any contacts"}
              </Text>
              <Text opacity={0.7} mt={1} fontSize={13} textAlign="center">
                {type == "group"
                  ? "Groups you have created or joined will appear here"
                  : " When a swift user accepts your message invite, they automatically are added to your contact list"}
              </Text>
            </Center>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SearchUsersContactsPane;

export function extractUniqueMembers(array: ChatLean[], userId: string) {
  const user: UserWithChatId[] = [];
  const lookUp: Record<string, boolean> = {};

  for (let i = 0; i < array.length; i++) {
    const chatMem = array[i].duo_chat_members;
    const chatId = array[i].id;

    for (let j = 0; j < chatMem.length; j++) {
      const member = chatMem[j].member;

      if (lookUp[member.id]) break;
      if (member.id === userId) continue;

      lookUp[member.id] = true;
      user.push({ ...member, chatId });
    }
  }

  return user;
}

function extractGroups(array: ChatLean[]) {
  return array.filter((chat) => chat.chatType === "group");
}
