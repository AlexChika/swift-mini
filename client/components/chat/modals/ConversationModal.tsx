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
} from "@chakra-ui/react";
import { useState } from "react";
import userOperations from "@/graphql/operations/users";
import { useLazyQuery } from "@apollo/client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ConversationModal({ onClose, isOpen }: Props) {
  const [username, setUsername] = useState("");
  const [searchUsers, { loading, data }] = useLazyQuery<
    SearchUsersReturn,
    SearchUsersVariable
  >(userOperations.Queries.searchUsers);

  function handleSearchUsers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = username.trim().toLowerCase();

    if (!name) return;
    searchUsers({ variables: { username: name } });
  }

  console.log({ data });

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

          <UserSearchList users={data?.searchUsers} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function UserSearchList({ users }: { users: SearchedUser[] | undefined }) {
  if (!users) return <div>No user found</div>;
  return <div>helli</div>;
}

export default ConversationModal;
