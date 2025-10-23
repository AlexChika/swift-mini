import { toRems } from "@/lib/helpers";
import { Button } from "@chakra-ui/react";

type Props = {
  type: "chat" | "group";
  onClick?: () => void;
};

function ModalBtn(prop: Props) {
  const { type, onClick } = prop;

  function dummy() {
    console.log("hit hard on SearchBtn");
  }

  return (
    <Button
      py={2}
      mb={4}
      w="100%"
      opacity={0.7}
      onClick={onClick || dummy}
      cursor="pointer"
      pos="relative"
      overflow="hidden"
      bg={type == "chat" ? "transparent" : "{colors.primaryBg/50}"}
      borderRadius={6}
      color="{colors.primaryText}"
      border={`1px solid {colors.primaryBg}`}
      fontSize={{ base: toRems(14), md: toRems(15) }}
      _hover={{
        opacity: 1,
        transform: "translateY(-2px)",
        boxShadow: "0 0 12px {colors.primaryBg}"
      }}
      _active={{
        opacity: 1,
        transform: "scale(0.98)",
        bg: "{colors.primaryBg}",
        boxShadow:
          "inset 1px 1px 1px {colors.secondaryBg}, inset -1px -1px 1px {colors.secondaryBg}"
      }}
      transition="all 0.3s ease">
      {type == "chat" ? "Find Swift Users" : "Create New Group"}
    </Button>
  );
}

export default ModalBtn;
