import { Session } from "next-auth";
import UsersList from "../UsersList";
import SwiftStore from "@/store/Store";
import { useSession } from "next-auth/react";
import { debounce, toRems } from "@/lib/helpers";
import useNavigate from "@/lib/hooks/useNavigate";
import CategorizedUsers from "./CategorizedUsers";
import { useCallback, useMemo, useState } from "react";
import { Box, Text, Input, Center, HStack } from "@chakra-ui/react";

export const sampleUsers: User[] = [
  { id: "1231", username: "ochkika", _id: "lol" },
  { id: "1232", username: "omhkika", _id: "lol" },
  { id: "1233", username: "oahkika", _id: "lol" },
  { id: "1234", username: "fahkika", _id: "lol" },
  { id: "1235", username: "fzhkika", _id: "lol" },
  { id: "1236", username: "fqhkika", _id: "lol" },
  { id: "1237", username: "gchkika", _id: "lol" },
  { id: "1238", username: "gdhkika", _id: "lol" },
  { id: "1239", username: "gyhkika", _id: "lol" },
  { id: "0123", username: "glhkika", _id: "lol" },
  { id: "11123", username: "hchkika", _id: "lol" },
  { id: "1223", username: "hohkika", _id: "lol" },
  { id: "13203789", username: "hphkika", _id: "lol" },
  { id: "1423", username: "hahkika", _id: "lol" },
  { id: "1523", username: "inhkika", _id: "lol" },
  { id: "1623", username: "ifhkika", _id: "lol" },
  { id: "1723", username: "ixhkika", _id: "lol" },
  { id: "1823", username: "iphkika", _id: "lol" },
  { id: "1923", username: "jlhkika", _id: "lol" },
  { id: "2023", username: "jahkika", _id: "lol" },
  { id: "2123", username: "jnhkika", _id: "lol" },
  { id: "22123", username: "jqhkika", _id: "lol" },
  { id: "23123", username: "kphkika", _id: "lol" },
  { id: "24123", username: "kahkika", _id: "lol" },
  { id: "25123", username: "kzhkika", _id: "lol" },
  { id: "1263", username: "pihkika", _id: "lol" },
  { id: "1273", username: "plhkika", _id: "lol" },
  { id: "1283", username: "pchkika", _id: "lol" },
  { id: "1293", username: "lchkika", _id: "lol" },
  { id: "1230", username: "achkika", _id: "lol" },
  { id: "3123", username: "mchkika", _id: "lol" },
  { id: "32123", username: "nchkika", _id: "lol" },
  { id: "1323", username: "echkika", _id: "lol" },
  { id: "33123", username: "cchkika", _id: "lol" },
  { id: "34123", username: "dchkika", _id: "lol" },
  { id: "35123", username: "bchkika", _id: "lol" },
  { id: "36123", username: "7chkika", _id: "lol" },
  { id: "37123", username: "7czhkika", _id: "lol" },
  { id: "38123", username: "7mchkika", _id: "lol" },
  { id: "39123", username: "7qchkika", _id: "lol" }
];

type UserWithChatId = User & { chatId: string };

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "user" | "group";
};

function SearchUsersContactsPane({ type, setIsOpen }: Props) {
  const { allChats } = SwiftStore();
  const { openChat } = useNavigate();
  const session = useSession().data as Session;

  const [username, setUsername] = useState("");
  const [searchedUser, _setSearchedUser] = useState<User[] | ChatLean[]>([]);

  const [lists] = useState(() => {
    if (type === "group") return extractGroups(allChats);
    else return extractUniqueMembers(allChats, session.user.id);
    // else return sampleUsers; // mock code - remove this.
  });

  const setSearchedUser = useMemo(() => {
    return debounce(_setSearchedUser, 100);
  }, []); // debounced

  const _searchUsers = useCallback(
    function (username: string) {
      const res =
        type == "group"
          ? (lists as ChatLean[]).filter((chat) =>
              chat.chatName?.includes(username)
            )
          : (lists as User[]).filter((user) =>
              user.username?.includes(username)
            );
      setSearchedUser(res);
    },

    [lists, setSearchedUser, type]
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
    (_: string, opts?: { chatId?: string }) => {
      openChat(opts?.chatId || "");
      setIsOpen(false);
    },
    [openChat, setIsOpen]
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
  const user: User[] = [];
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
