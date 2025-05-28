import {
  Button,
  Dialog,
  Progress,
  Text,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";

function InProgressModal() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* <Button onClick={onOpen}>Trigger modal</Button> */}

      <Dialog.Root
        placement="center"
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content color="{colors.primaryText}" bg="{colors.white}">
              <Dialog.Header>
                <Dialog.Title></Dialog.Title>
              </Dialog.Header>

              <Dialog.Body textAlign="center">
                <Text> Swift mini App is in progress</Text>
                <Progress.Root size="md" mt={2}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default InProgressModal;
