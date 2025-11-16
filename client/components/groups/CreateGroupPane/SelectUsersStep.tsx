import { Session } from "next-auth";
import SwiftStore from "@/store/swiftStore";
import { debounce } from "@/lib/helpers";
import { LeftArrowIcon } from "@/lib/icons";
import SelectedUsers from "./SelectedUsers";
import { useSession } from "next-auth/react";
import { useEvent } from "@/lib/hooks/useEvents";
import { useCallback, useMemo, useRef, useState } from "react";
import NoChats from "@/components/allChats/CreateNewChatModal/NoChats";
import { Box, Text, Input, HStack, Button, Icon } from "@chakra-ui/react";
import UsersList from "@/components/allChats/CreateNewChatModal/UsersList";
import CategorizedUsers from "@/components/allChats/CreateNewChatModal/SearchUsersPane/CategorizedUsers";
import { extractUniqueMembers } from "@/components/allChats/CreateNewChatModal/SearchUsersPane/SearchUsersContactsPane";

type Props = {
  nextStep: (goto: boolean | number) => void;
  setUIState: React.Dispatch<React.SetStateAction<Swift.Create_Chats_UI_State>>;
};

function SelectUsersStep(props: Props) {
  const { nextStep, setUIState } = props;

  const { allChats } = SwiftStore();
  const session = useSession().data as Session;
  const { dispatch } = useEvent("GROUP_SELECTED_USERS");

  const [username, setUsername] = useState("");
  const [searchedUsers, setSearchedUser] = useState<User[]>([]);
  const [lists] = useState(extractUniqueMembers(allChats, session.user.id));

  const contactListRef = useRef<HTMLDivElement>(null);
  const selectedUsersRef = useRef<Record<string, boolean>>({});

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
    return debounce(_searchUsers, 350);
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
        `[data-swift-userlist-item="${id}"]`
      );
      (el as HTMLElement)?.click();
    },
    [handleSelect]
  );

  // continues to the Group Details Step
  function handleContinue() {
    dispatch(selectedUsers);
    setUIState("createGroupDetails");
    nextStep(true);
  }

  const customProps = useMemo(() => {
    return {
      onClick: callHandleSelect,
      checkMarks: true,
      emptyListText:
        "Either user you searched for has been selected or no matching username",
      type: "user" as const,
      userList: searchedUsers as User[]
    };
  }, [searchedUsers, callHandleSelect]);

  return (
    <Box h="100%">
      <Input
        value={username}
        borderRadius={6}
        autoComplete="off"
        name="search users"
        onChange={handleSearch}
        placeholder="Type a username to search"
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
          onClick={handleContinue}
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

export default SelectUsersStep;
