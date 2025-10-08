import UsersList from "../UsersList";
import { throttle, toRems } from "@/lib/helpers";
import { useLazyQuery } from "@apollo/client/react";
import userOps from "@/graphql/operations/user.ops";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, HStack, Input, Spinner, Text, VStack } from "@chakra-ui/react";

function SearchSwiftUsersPane() {
  const [username, setUsername] = useState("");

  const [search, { loading, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariable
  >(userOps.Queries.searchUsers, { fetchPolicy: "no-cache" });

  const [users, setUsers] = useState<SearchUsersData["searchUsers"]>([]);

  const searchUsers = useMemo(() => {
    return throttle(search, 350);
  }, [search]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    let username = e.target.value;
    setUsername(username);

    username = username.trim().toLowerCase();
    if (!username) return;

    searchUsers({ variables: { username } });
  }

  const InputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!InputRef.current) return;
    InputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!data?.searchUsers) return;
    setUsers(data.searchUsers);
  }, [data]);

  return (
    <Box h="85dvh" border="2px solid greeny">
      <Input
        ref={InputRef}
        value={username}
        borderRadius={6}
        onChange={handleSearch}
        placeholder="Type a username to search"
      />

      <VStack mt={5} alignItems="center">
        {loading && (
          <Spinner
            size="md"
            color="var(--swftReverseLight)"
            borderWidth={3}
            css={{ "--spinner-track-color": "red" }}
          />
        )}

        <HStack maxW="95%" wrap="nowrap" mb={2}>
          <Text whiteSpace="nowrap">
            People using
            <Text color="gray.600" fontSize={16} as="span" className="swftMini">
              &nbsp; Swift &nbsp;
            </Text>
            - Search for
          </Text>

          <Text truncate px={1} bg="{colors.primaryBg/20}">
            {username || "none"}
          </Text>
        </HStack>
      </VStack>

      <Box
        h={`calc(100% - ${loading ? toRems(125) : toRems(100)})`}
        border="2px solid redy">
        <UsersList userList={users} bg="{colors.primaryBg/20}" />
      </Box>
    </Box>
  );
}

export default SearchSwiftUsersPane;
