import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import userOperations from "@/graphql/operations/users";
import { useLazyQuery } from "@apollo/client";
import CloseIcon from "@/lib/icons/CloseIcon";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ConversationModal({ onClose, isOpen }: Props) {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<SearchedUser[]>([]);

  const [searchUsers, { loading, data }] = useLazyQuery<
    SearchUsersReturn,
    SearchUsersVariable
  >(userOperations.Queries.searchUsers);

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

    setParticipants((prev) => [...prev, user]);
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }

  async function onCreateConversation() {
    try {
    } catch (error) {
      const e = error as unknown as { message: string };
      toast.error(e?.message, {
        id: "create conversation",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#2d2d2d" pb={4}>
        <ModalHeader>Create a conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSearchUsers}>
            <Stack spacing={4}>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
              />
              <Button isLoading={loading} isDisabled={!username} type="submit">
                Search
              </Button>
            </Stack>
          </form>

          {data?.searchUsers && (
            <UserSearchList
              users={data?.searchUsers}
              addParticipant={addParticipant}
            />
          )}

          {participants.length > 0 && (
            <>
              <Participants
                removeParticipant={removeParticipant}
                participants={participants}
              />
              <Button onClick={() => {}} w="100%" mt={6} colorScheme="blue">
                Create Conversation
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// border = "2px solid red";
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
            spacing={4}
            py={2}
            px={2}
            borderRadius={4}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <Avatar name={user.username} size={"sm"} />
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

type ParticipantsProps = {
  participants: SearchedUser[];
  removeParticipant: (id: string) => void;
};

function Participants({ participants, removeParticipant }: ParticipantsProps) {
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
              variant="link"
              aria-label="delete selected user button"
              icon={<CloseIcon color="white" />}
            />
          </Stack>
        );
      })}
    </Flex>
  );
}

export default ConversationModal;
