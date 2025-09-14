import { AIIcon } from "@/lib/icons";
import SwiftMini from "./SwiftMini";
import { HStack, Icon, Text } from "@chakra-ui/react";

function NavBar({ page }: { page: PageName }) {
  console.log({ page });

  return (
    <HStack mt={2} mb={4} alignItems="center" justifyContent={"space-between"}>
      <SwiftMini />

      <HStack border="1px solid redy">
        {/* Desktop only */}
        <HStack
          pr={2}
          display={{ base: "none", xmd: "flex" }}
          alignItems="center"
          fontWeight={600}
          textTransform="capitalize">
          <Text opacity={0.7}>{page}</Text>

          {page === "Swift AI" && (
            <Icon color="red.600">
              <AIIcon />
            </Icon>
          )}
        </HStack>

        {/* Mobile only */}
        <HStack display={{ base: "flex", xmd: "none" }}>Mobile only</HStack>
      </HStack>
    </HStack>
  );
}

export default NavBar;
