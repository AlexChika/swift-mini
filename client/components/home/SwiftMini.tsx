import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

function SwiftMini() {
  return (
    <ChakraLink
      p={0}
      m={0}
      className="swftMini"
      fontSize="1.5rem"
      color="red.600"
      asChild>
      <NextLink href="/">SwiftMini</NextLink>
    </ChakraLink>
  );
}

export default SwiftMini;
