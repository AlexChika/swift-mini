import { AIIcon } from "@/lib/icons";
import SwiftMini from "./SwiftMini";
import { HStack, Icon, Text } from "@chakra-ui/react";

function NavBar({ page }: { page: PageName }) {
  console.log({ page });

  return (
    <HStack justifyContent={"space-between"} mt={2} mb={4}>
      <SwiftMini />

      <HStack border="1px solid redy">
        <HStack alignItems="center" fontWeight={600} textTransform="capitalize">
          <Text>{page}</Text>
          {page === "Swift AI" && (
            <Icon color="red.600">
              <AIIcon />
            </Icon>
          )}
        </HStack>
      </HStack>
    </HStack>
  );
}

export default NavBar;
