import {
  Stack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  IconButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import React from "react";
import userOperations from "@/graphql/operations/users";
import convoOperations from "@/graphql/operations/conversations";
import { useLazyQuery, useMutation } from "@apollo/client";
import CloseIcon from "@/lib/icons/CloseIcon";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session;
};

function ConversationModal({ isOpen, setIsOpen, session }: Props) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [participants, setParticipants] = React.useState<SearchedUser[]>([]);

  const [searchUsers, { loading, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariable
  >(userOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationVariable>(
      convoOperations.Mutations.createConversation
    );

  // functions
  function handleSearchUsers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = username.trim().toLowerCase();

    if (!name) return;
    searchUsers({ variables: { username: name } });
  }

  function addParticipant(user: SearchedUser) {
    const userExist = participants.find((p) => p.id === user.id);
    if (userExist) return;

    setUsername("");
    setParticipants((prev) => [...prev, user]);
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }

  async function onCreateConversation() {
    const participantIds = [...participants.map((p) => p.id), session.user.id];
    try {
      const { data } = await createConversation({
        variables: { participantIds },
      });

      const { conversationId } = data?.createConversation || {};

      if (!conversationId) throw new Error("Failed to create conversation");

      router.replace(`/?conversationId=${conversationId}`);
      setParticipants([]);
      setUsername("");
      setIsOpen(false);
    } catch (error) {
      const e = error as unknown as { message: string };
      toast.error(e?.message, {
        id: "create conversation",
      });
    }
  }

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            mx={2}
            border={"1px solid {colors.secondaryBg}"}
            color="{colors.primaryText}"
            bg="{colors.primaryBg}"
            pb={4}
          >
            <Dialog.Header>
              <Dialog.Title>Create a conversation</Dialog.Title>
            </Dialog.Header>

            {/* <ModalCloseButton /> */}

            <Dialog.Body>
              {/*
               *
               *
               * Username Input Form */}
              <form onSubmit={handleSearchUsers}>
                <Stack gap={4}>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                  <Button
                    color="{colors.primaryText}"
                    bg="{colors.secondaryBg}"
                    loading={loading}
                    disabled={!username}
                    type="submit"
                  >
                    Search
                  </Button>
                </Stack>
              </form>

              {/*
           *
           *
           Search Result List */}
              {data?.searchUsers && (
                <UserSearchList
                  users={data?.searchUsers}
                  addParticipant={addParticipant}
                />
              )}

              {/*
           *
           *
           Selected users {participants}*/}
              {participants.length > 0 && (
                <>
                  <SelectedParticipants
                    removeParticipant={removeParticipant}
                    participants={participants}
                  />
                  <Button
                    loading={createConversationLoading}
                    onClick={() => onCreateConversation()}
                    w="100%"
                    mt={6}
                    colorScheme="blue"
                  >
                    Create Conversation
                  </Button>
                </>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
/*
 *
 */
type ListProp = {
  users: SearchedUser[];
  addParticipant: (user: SearchedUser) => void;
};
function UserSearchList({ users, addParticipant }: ListProp) {
  if (users.length < 1)
    return (
      <Text mt={5} textAlign="center" fontSize="14px" color="whiteAlpha.500">
        No user found
      </Text>
    );

  return (
    <Stack mt={3}>
      {users.map((user) => {
        return (
          <Stack
            key={user.id}
            direction="row"
            align="center"
            gap={4}
            py={2}
            px={2}
            borderRadius={4}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <Avatar.Root size={"sm"} variant="solid">
              <Avatar.Fallback name={user.username} />
            </Avatar.Root>
            <Flex align="center" justify="space-between" w="100%">
              <Text>{user.username}</Text>
              <Button
                size="sm"
                onClick={() => addParticipant(user)}
                colorScheme="blue"
                variant="outline"
              >
                Select
              </Button>
            </Flex>
          </Stack>
        );
      })}
    </Stack>
  );
}

/*
 *
 */
type ParticipantsProps = {
  participants: SearchedUser[];
  removeParticipant: (id: string) => void;
};
function SelectedParticipants({
  participants,
  removeParticipant,
}: ParticipantsProps) {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((p) => {
        return (
          <Stack
            bg="whiteAlpha.200"
            borderRadius={4}
            p={2}
            align="center"
            key={p.id}
            direction="row"
          >
            <Text>{p.username}</Text>
            <IconButton
              onClick={() => removeParticipant(p.id)}
              variant="plain"
              aria-label="delete selected user button"
            >
              <CloseIcon color="white" />
            </IconButton>
          </Stack>
        );
      })}
    </Flex>
  );
}

export default ConversationModal;
