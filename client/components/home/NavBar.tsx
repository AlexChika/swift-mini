import SwiftMini from "./SwiftMini";
import { HStack, Icon, Text } from "@chakra-ui/react";
import { AIIcon, SearchIcon, DotsVerticalIcon } from "@/lib/icons";
import NavMenu from "./NavMenu";

type Props = {
  page: PageName;
  handleMenuClick: (param: Param) => void;
};

function NavBar({ page, handleMenuClick }: Props) {
  return (
    <HStack py={2} mb={4} alignItems="center" justifyContent={"space-between"}>
      <SwiftMini />

      {/* Desktop only */}
      <HStack
        pr={2}
        mt={1}
        display={{ base: "none", xmd: "flex" }}
        alignItems="center"
        fontWeight={600}
        textTransform="capitalize">
        <Text fontSize={18} opacity={0.7}>
          {page}
        </Text>

        {page === "Swift AI" && <AIIcon color="red.600" />}
      </HStack>

      {/* Mobile only */}
      <HStack gap={3} display={{ base: "flex", xmd: "none" }}>
        <button
          aria-label="open search"
          onClick={() => handleMenuClick("search")}>
          <Icon size="lg">
            <SearchIcon />
          </Icon>
        </button>

        <NavMenu handleMenuClick={handleMenuClick} />
      </HStack>
    </HStack>
  );
}

export default NavBar;
