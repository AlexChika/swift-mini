import toast from "react-hot-toast";
import UsersList from "../UsersList";
import { throttle, toRems } from "@/lib/helpers";
import useNavigate from "@/lib/hooks/useNavigate";
import Spinner from "@/components/general/Spinner";
import chatOps from "@/graphql/operations/chat.ops";
import userOps from "@/graphql/operations/user.ops";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Center, HStack, Input, Text, VStack } from "@chakra-ui/react";

type CreateDuoChatVariable = {
  otherUserId: string;
};

type CreateDuoChatData = {
  createDuoChat: ApiReturn<string, "chatId">;
};

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchSwiftUsersPane({ setIsOpen }: Props) {
  const [username, setUsername] = useState("");

  const [search, { loading, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariable
  >(userOps.Queries.searchUsers, { fetchPolicy: "no-cache" });

  const [users, setUsers] = useState<UserLean[]>([]);

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

  const { openChat } = useNavigate();

  const [createDuoChat, { loading: createChatLoading }] = useMutation<
    CreateDuoChatData,
    CreateDuoChatVariable
  >(chatOps.Mutations.createDuoChat);

  const createNewChat = useCallback(
    async function (otherUserId: string) {
      try {
        const { data } = await createDuoChat({
          variables: { otherUserId }
        });

        const res = data?.createDuoChat;
        if (!res) throw new Error("Failed to create chat");

        if (res.success) {
          openChat(res.chatId);
          setIsOpen(false);
        } else return toast.error(res.msg, { id: "create chat" });
      } catch (error) {
        const e = error as unknown as { message: string; cause: string };
        toast.error("Unable to create chat", { id: "create chat" });
        console.log(e.message || e, "create new chat");
      }
    },
    [createDuoChat, openChat, setIsOpen]
  );

  const InputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!InputRef.current) return;
    InputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!data?.searchUsers) return;
    if (!data.searchUsers.success) {
      toast.error(data.searchUsers.msg, { id: "search users", duration: 5000 });
      return;
    }
    setUsers(data.searchUsers.users);
  }, [data]);

  return (
    <Box h="85dvh" pos="relative">
      <Input
        ref={InputRef}
        value={username}
        borderRadius={6}
        onChange={handleSearch}
        placeholder="Type a username to search"
      />

      {createChatLoading && (
        <Center
          inset="0"
          pos="absolute"
          aria-busy="true"
          userSelect="none"
          cursor="not-allowed"
          bg="{colors.secondaryBg/60}">
          <Spinner />
        </Center>
      )}

      <VStack mt={5} alignItems="center">
        {loading && <Spinner />}

        <HStack maxW="95%" wrap="nowrap" mb={2}>
          <Text whiteSpace="nowrap">
            People using
            <Text
              color="gray.600"
              fontSize={16}
              as="span"
              className="swiftMini">
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
        <UsersList
          customProps={{
            type: "user",
            userList: users as User[],
            onClick: createNewChat
          }}
          bg="{colors.primaryBg/20}"
        />
      </Box>
    </Box>
  );
}

export default SearchSwiftUsersPane;
