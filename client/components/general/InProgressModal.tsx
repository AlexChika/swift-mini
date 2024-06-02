import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

function InProgressModal() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      {/* <Button onClick={onOpen}>Trigger modal</Button> */}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center"></ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Text> Swift mini App is in progress</Text>
            <Progress mt={6} size="sm" hasStripe value={47} />
          </ModalBody>

          <ModalFooter>
            {/* <Progress hasStripe value={47} /> */}
            {/* <Button onClick={onClose}>Close</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InProgressModal;
