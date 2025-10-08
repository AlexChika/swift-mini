import { ColorMode } from "@/lib/helpers";
import { LeftArrowIcon } from "@/lib/icons";
import {
  Text,
  HStack,
  Dialog,
  CloseButton,
  IconButton
} from "@chakra-ui/react";

type Props = {
  onClick?: () => void;
  showBackBtn?: boolean;
};

function ModalHeader(prop: Props) {
  const { showBackBtn = false, onClick = dummy } = prop;

  function dummy() {
    console.log("hit hard on ModalHeader");
  }

  return (
    <HStack py={2} mb={2} justifyContent="space-between">
      <ColorMode.ThemeButton />

      {showBackBtn && (
        <IconButton onClick={onClick} variant="plain" size="sm">
          <LeftArrowIcon />
        </IconButton>
      )}

      {!showBackBtn && <span></span>}

      <Text fontWeight={500} textAlign="center">
        Create New Chat
      </Text>

      <Dialog.CloseTrigger pos="static" asChild>
        <CloseButton
          colorPalette="red"
          outline="none"
          color="{colors.primaryText}"
          size="sm"
        />
      </Dialog.CloseTrigger>
    </HStack>
  );
}

export default ModalHeader;
