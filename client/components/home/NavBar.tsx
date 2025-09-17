import NavMenu from "./NavMenu";
import SwiftMini from "./SwiftMini";
import { AIIcon, SearchIcon } from "@/lib/icons";
import { HStack, Icon, Text } from "@chakra-ui/react";

type Props = {
  pageName: PageName;
  handleMenuClick: (param: Param) => void;
};

function NavBar({ pageName, handleMenuClick }: Props) {
  return (
    <HStack py={2} mb={4} alignItems="center" justifyContent={"space-between"}>
      <SwiftMini />

      {/* Desktop only */}
      <HStack
        pr={2}
        mt={1}
        display={{ base: "none", xmd: "flex" }}
        alignItems="center"
        textTransform="capitalize">
        <Text fontWeight={600} fontSize={16} opacity={0.7}>
          {pageName}
        </Text>

        {pageName === "Swift AI" && <AIIcon color="red.600" />}
      </HStack>

      {/* Mobile only */}
      <HStack gap={3} display={{ base: "flex", xmd: "none" }}>
        <button
          aria-label="open search"
          onClick={() => handleMenuClick("search")}>
          <Icon
            color={pageName === "Search" ? "red.600" : "{colors.primaryText}"}
            size="lg">
            <SearchIcon />
          </Icon>
        </button>

        <NavMenu pageName={pageName} handleMenuClick={handleMenuClick} />
      </HStack>
    </HStack>
  );
}

export default NavBar;
