import SwiftMini from "./SwiftMini";
import { HStack, Text } from "@chakra-ui/react";

function NavBar({ page }: { page: PageName }) {
  console.log({ page });

  return (
    <HStack justifyContent={"space-between"} mt={2} mb={4}>
      <SwiftMini />

      <HStack border="1px solid redy">
        <Text fontWeight={600} textTransform="capitalize">
          {page}
        </Text>
      </HStack>
    </HStack>
  );
}

export default NavBar;
