import { InfoCircleIcon } from "@/lib/icons";
import {
  Dialog,
  Progress,
  Text,
  Portal,
  CloseButton,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";
import ToolTip from "./ToolTip";

function InProgressModal() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Dialog.Root
        size="sm"
        placement="center"
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner padding={1}>
            <Dialog.Content
              border={"1px solid {colors.secondaryBg}"}
              color="{colors.primaryText}"
              bg="{colors.secondaryBg}">
              <Dialog.Header>
                <Dialog.Title>App is in progress</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body textAlign="center">
                <Text>
                  The development of the swiftmini app is still in progress.
                  This is mainly a prototype. The backend code is currently
                  being written.
                </Text>

                <Progress.Root
                  py={5}
                  colorPalette="{colors.primaryText}"
                  variant="subtle"
                  defaultValue={25}
                  maxW="sm"
                  size="sm">
                  <HStack gap="5">
                    <ToolTip content="The SwiftMini app is 25% complete">
                      <Progress.Label cursor="pointer">
                        <InfoCircleIcon />
                      </Progress.Label>
                    </ToolTip>

                    <Progress.Track flex="1">
                      <Progress.Range />
                    </Progress.Track>

                    <Progress.ValueText>25%</Progress.ValueText>
                  </HStack>
                </Progress.Root>
              </Dialog.Body>

              <Dialog.CloseTrigger asChild>
                <CloseButton color="{colors.primaryText}" size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default InProgressModal;
