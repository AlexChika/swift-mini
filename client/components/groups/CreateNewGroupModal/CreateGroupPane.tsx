import { Session } from "next-auth";
import SwiftStore from "@/store/Store";
import { debounce } from "@/lib/helpers";
import SelectedUsers from "./SelectedUsers";
import { useSession } from "next-auth/react";
import useNavigate from "@/lib/hooks/useNavigate";
import { Box, Text, Input, HStack, Button, Icon } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UsersList from "@/components/allChats/CreateNewChatModal/UsersList";
import CategorizedUsers from "@/components/allChats/CreateNewChatModal/SearchUsersPane/CategorizedUsers";
import { extractUniqueMembers } from "@/components/allChats/CreateNewChatModal/SearchUsersPane/SearchUsersContactsPane";
import NoChats from "@/components/allChats/CreateNewChatModal/NoChats";
import { LeftArrowIcon } from "@/lib/icons";

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

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateGroupPane(props: Props) {
  const { setIsOpen } = props;
  const { openChat } = useNavigate();
  const { allChats } = SwiftStore();
  const session = useSession().data as Session;

  const [username, setUsername] = useState("");
  const contactListRef = useRef<HTMLDivElement>(null);
  const [searchedUser, setSearchedUser] = useState<User[]>([]);
  const selectedUsersRef = useRef<Record<string, boolean>>({});
  const [lists] = useState(extractUniqueMembers(allChats, session.user.id));

  // const [lists] = useState(sampleUsers); // uncomment this // remove thiss
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const _searchUsers = useCallback(
    function (username: string) {
      const res = lists.filter((user) => {
        if (
          user.username?.includes(username) &&
          !selectedUsersRef.current[user.id]
        )
          return true;
        return false;
      });

      requestIdleCallback(() => {
        setSearchedUser(res);
      });
    },
    [lists]
  );

  const searchUsers = useMemo(() => {
    return debounce(_searchUsers, 300);
  }, [_searchUsers]); // debounced

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    let username = e.target.value;
    setUsername(username);

    username = username.trim().toLowerCase();
    if (!username) username = "(<<__SWIFT_??_EMPTY__>>)";

    searchUsers(username);
  }

  // selects users
  const handleSelect = useCallback(
    function (id: string, opts?: { isTrusted: boolean }) {
      if (!opts?.isTrusted) return;
      if (!selectedUsersRef.current) return;
      const isSelected = selectedUsersRef.current[id];

      if (isSelected) {
        delete selectedUsersRef.current[id];
      } else {
        selectedUsersRef.current[id] = true;
        setSearchedUser((prev) => prev.filter((user) => user.id !== id));
      }

      setSelectedUsers(
        lists.filter((user) => selectedUsersRef.current[user.id])
      );
    },

    [lists]
  );

  // wraps handleSelect used to sync UI between memoed categorized list
  const callHandleSelect = useCallback(
    function (id: string, opts?: { isTrusted: boolean }) {
      handleSelect(id, opts);
      const el = contactListRef.current?.querySelector(
        `[data-swft-userlist-item="${id}"]`
      );
      (el as HTMLElement)?.click();
    },
    [handleSelect]
  );

  const customProps = useMemo(() => {
    return {
      onClick: callHandleSelect,
      checkMarks: true,
      emptyListText:
        "Either user you searched for has been selected or no matching username",
      type: "user" as const,
      userList: searchedUser as User[]
    };
  }, [searchedUser, callHandleSelect]);

  const InputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!InputRef.current) return;
    InputRef.current.focus();
  }, []);

  return (
    <Box h="calc(100% - 3.75rem)">
      <Text
        mb={2}
        textAlign="center"
        color="gray.400"
        _dark={{ color: "gray.600" }}>
        Select atleast 1 users to create a group
      </Text>

      <Input
        ref={InputRef}
        value={username}
        borderRadius={6}
        autoComplete="off"
        onChange={handleSearch}
        name="search users"
        placeholder="Type a username to search"
      />

      {/* body of search  pane */}
      <Box
        mt={5}
        overflowY="scroll"
        h="calc(100% - 5rem)"
        scrollbarWidth="none"
        border="2px solid redy">
        <HStack
          pt={2}
          pb={1}
          maxW="95%"
          wrap="nowrap"
          color="gray.400"
          _dark={{ color: "gray.600" }}
          justify="space-between">
          <Text whiteSpace="nowrap">Contact list search results</Text>

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
          maxH={`calc(100% - 55%)`}
        />

        {/* selected users */}
        <Box mt={10} h="auto">
          <Text
            mb={2}
            display="flex"
            color="gray.400"
            _dark={{ color: "gray.600" }}
            justifyContent="space-between">
            <Text as="span">Selected users</Text>
            <Text as="span">{selectedUsers.length} selected</Text>
          </Text>

          <SelectedUsers
            unselect={callHandleSelect}
            border="1px solid {colors.primaryText/20}"
            selectedList={selectedUsers}
          />
        </Box>

        <Button
          mt={5}
          w="100%"
          _hover={{
            letterSpacing: "wider"
          }}
          colorPalette="teal"
          disabled={selectedUsers.length < 1}>
          {selectedUsers.length > 0 ? (
            <>
              Continue
              <Icon rotate="180deg" size="xs">
                <LeftArrowIcon />
              </Icon>
            </>
          ) : (
            "Select users to continue"
          )}
        </Button>

        {/* users contact list*/}
        <Box ref={contactListRef} mt={10}>
          <Text
            mb={3}
            display="flex"
            color="gray.400"
            _dark={{ color: "gray.600" }}
            justifyContent="space-between">
            <Text as="span">Your swift contacts</Text>
            <Text as="span">{lists.length} contacts</Text>
          </Text>

          <CategorizedUsers
            type="user"
            checkMarks={true}
            userClick={handleSelect}
            list={lists as User[]}
          />

          {lists.length < 1 && <NoChats customProps={{ type: "chats" }} />}
        </Box>
      </Box>
    </Box>
  );
}

export default CreateGroupPane;
