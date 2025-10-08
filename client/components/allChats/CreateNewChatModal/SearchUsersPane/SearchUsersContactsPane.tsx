import { Session } from "next-auth";
import UsersList from "../UsersList";
import SwiftStore from "@/store/Store";
import { useSession } from "next-auth/react";
import { debounce, throttle, toRems } from "@/lib/helpers";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, Input, Center, Avatar, HStack } from "@chakra-ui/react";

export const sampleUsers: User[] = [
  { id: "123", username: "ochkika", _id: "lol" },
  { id: "123", username: "omhkika", _id: "lol" },
  { id: "123", username: "oahkika", _id: "lol" },
  { id: "123", username: "fahkika", _id: "lol" },
  { id: "123", username: "fzhkika", _id: "lol" },
  { id: "123", username: "fqhkika", _id: "lol" },
  { id: "123", username: "gchkika", _id: "lol" },
  { id: "123", username: "gdhkika", _id: "lol" },
  { id: "123", username: "gyhkika", _id: "lol" },
  { id: "123", username: "glhkika", _id: "lol" },
  { id: "123", username: "hchkika", _id: "lol" },
  { id: "123", username: "hohkika", _id: "lol" },
  { id: "123", username: "hphkika", _id: "lol" },
  { id: "123", username: "hahkika", _id: "lol" },
  { id: "123", username: "inhkika", _id: "lol" },
  { id: "123", username: "ifhkika", _id: "lol" },
  { id: "123", username: "ixhkika", _id: "lol" },
  { id: "123", username: "iphkika", _id: "lol" },
  { id: "123", username: "jlhkika", _id: "lol" },
  { id: "123", username: "jahkika", _id: "lol" },
  { id: "123", username: "jnhkika", _id: "lol" },
  { id: "123", username: "jqhkika", _id: "lol" },
  { id: "123", username: "kphkika", _id: "lol" },
  { id: "123", username: "kahkika", _id: "lol" },
  { id: "123", username: "kzhkika", _id: "lol" },
  { id: "123", username: "pihkika", _id: "lol" },
  { id: "123", username: "plhkika", _id: "lol" },
  { id: "123", username: "pchkika", _id: "lol" },
  { id: "123", username: "lchkika", _id: "lol" },
  { id: "123", username: "achkika", _id: "lol" },
  { id: "123", username: "mchkika", _id: "lol" },
  { id: "123", username: "nchkika", _id: "lol" },
  { id: "123", username: "echkika", _id: "lol" },
  { id: "123", username: "cchkika", _id: "lol" },
  { id: "123", username: "dchkika", _id: "lol" },
  { id: "123", username: "bchkika", _id: "lol" }
];

function SearchUsersContactsPane() {
  const { allChats } = SwiftStore();
  const session = useSession().data as Session;

  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState<User[]>([]);

  console.log({ searchedUser });

  const users = useMemo(() => {
    console.log("re run");
    // real code
    // return extractUniqueMembers(allChats, session.user.id);
    return sampleUsers; // mock code - remove this.
  }, []);

  const categorizedUsers = useMemo(() => {
    return categorizeUserAlphabetically(users);
  }, [users]);

  const search = useCallback(
    function (username: string) {
      const res = users
        .filter((user) => user.username?.includes(username))
        .slice(0, 15);
      debounce(() => setSearchedUser(res), 100)();
    },
    [users]
  );

  const searchUsers = useMemo(() => {
    return throttle(search, 300);
  }, [search]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    let username = e.target.value;
    setUsername(username);

    username = username.trim().toLowerCase();
    if (!username) username = "(<<__SWIFT_??_EMPTY__>>)";

    searchUsers(username);
  }

  const InputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!InputRef.current) return;
    InputRef.current.focus();
  }, []);

  return (
    <Box h="calc(100% - 3.75rem)">
      <Input
        ref={InputRef}
        value={username}
        borderRadius={6}
        onChange={handleSearch}
        name="search users"
        placeholder="Type a username to search"
      />

      {/* body of search  pane */}
      <Box
        mt={5}
        overflowY="scroll"
        h="calc(100% - 4rem)"
        scrollbarWidth="none"
        border="2px solid redy">
        <HStack
          pt={2}
          pb={1}
          maxW="95%"
          wrap="nowrap"
          color="gray.600"
          justify="space-between">
          <Text whiteSpace="nowrap">Contact list search results</Text>

          <Text> - </Text>

          <Text as="span" truncate px={1} bg="{colors.primaryBg/20}">
            Search for {username || "none"}
          </Text>
        </HStack>

        {/* userlist from search */}
        <UsersList
          scrollbarWidth="1px"
          userList={searchedUser}
          bg="{colors.primaryBg/20}"
          maxH={`calc(100% - ${toRems(130)})`}
        />

        {/* users contact list */}
        <Box mt={8}>
          <Text
            mb={-4}
            display="flex"
            color="gray.600"
            justifyContent="space-between">
            <Text as="span">Your swift contacts</Text>
            <Text as="span">{users.length} contacts</Text>
          </Text>

          <CategorizedUsers categories={categorizedUsers} />

          {categorizedUsers.length < 1 && (
            <Center
              mt={5}
              h="9rem"
              flexDir="column"
              color="gray.500"
              border="1px dashed">
              <Text>You are yet to add any contacts</Text>
              <Text opacity={0.7} mt={1} fontSize={13} textAlign="center">
                When a swift user accepts your message invite, they
                automatically are added to your contact list
              </Text>
            </Center>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SearchUsersContactsPane;

function extractUniqueMembers(array: ChatLean[], userId: string) {
  const user: ChatLean["duo_chat_members"][0]["member"][] = [];
  const lookUp: Record<string, boolean> = {};

  for (let i = 0; i < array.length; i++) {
    const chatMem = array[i].duo_chat_members;

    for (let j = 0; j < chatMem.length; j++) {
      const id = chatMem[j].member.id;

      if (lookUp[id]) break;
      if (id === userId) continue;

      lookUp[id] = true;
      user.push(chatMem[j].member);
    }
  }

  return user;
}

function categorizeUserAlphabetically(users: User[]) {
  const categories: Record<
    string,
    {
      alphabet: string;
      userList: User[];
    }
  > = {};

  // here we are grouping into categories
  for (let i = 0; i < users.length; i++) {
    const alphabet = users[i].username!.substring(0, 1).toLowerCase();
    if (!categories[alphabet]) {
      categories[alphabet] = {
        alphabet,
        userList: [users[i]]
      };
      continue;
    }

    categories[alphabet].userList.push(users[i]);
  }

  // here we are sorting the alphabet category
  const categoriesArr = Object.values(categories).sort((a, b) => {
    if (a.alphabet < b.alphabet) return -1;
    if (a.alphabet > b.alphabet) return 1;
    else return 0;
  });

  // here we are sorting the list in each category
  for (let i = 0; i < categoriesArr.length; i++) {
    categoriesArr[i].userList.sort((a, b) => {
      if (a.username! < b.username!) return -1;
      if (a.username! > b.username!) return 1;
      else return 0;
    });
  }

  return categoriesArr;
}

type CategorizedUsersProp = {
  categories: {
    alphabet: string;
    userList: User[];
  }[];
};

function _CategorizedUsers({ categories }: CategorizedUsersProp) {
  return categories.map((category) => {
    const { alphabet, userList } = category;
    return (
      <Box mt={7} key={alphabet}>
        <HStack mb={1.5}>
          <Avatar.Root size="sm">
            <Avatar.Fallback colorInterpolation="auto" name={alphabet} />
          </Avatar.Root>
        </HStack>

        <UsersList userList={userList} bg="{colors.primaryBg/20}" />
      </Box>
    );
  });
}

const CategorizedUsers = memo(_CategorizedUsers);
