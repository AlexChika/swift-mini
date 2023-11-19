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
import { useQuery } from "@apollo/client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ConversationModal({ onClose, isOpen }: Props) {
  const [username, setUsername] = useState("");
  const {} = useQuery(userOperations.Queries.searchUsers);

  async function handleSearchUsers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#2d2d2d" pb={4}>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSearchUsers}>
            <Stack spacing={4}>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
              />
              <Button isDisabled={!username} type="submit">
                Search
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ConversationModal;
