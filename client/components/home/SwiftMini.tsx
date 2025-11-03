import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

function SwiftMini() {
  return (
    <ChakraLink
      outline="none"
      p={0}
      m={0}
      className="swiftMini"
      fontSize="1.5rem"
      color="red.600"
      asChild>
      <NextLink href="/?swift=home">SwiftMini</NextLink>
    </ChakraLink>
  );
}

export default SwiftMini;
