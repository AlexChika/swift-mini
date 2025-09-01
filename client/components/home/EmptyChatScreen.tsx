import { Center, Image, Text, VStack } from "@chakra-ui/react";

function EmptyChatScreen() {
  return (
    <Center
      dir="column"
      bg="{colors.emptyChatScreen}"
      border="4px solid {colors.appBorder}"
      borderLeft={{ xmd: "none" }}
      display={{ base: "none", xmd: "flex" }}
      css={{
        margin: { base: "0px", xmd: "5px 5px 5px 0px" },
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" }
      }}
      w="100%">
      <VStack>
        <Image opacity={0.7} maxW="150px" alt="Logo Image" src="/icon.png" />

        <Text userSelect="none" opacity={0.3} color="{colors.primaryText}">
          No conversation selected
        </Text>
      </VStack>
    </Center>
  );
}

export default EmptyChatScreen;
