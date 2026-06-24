import NextLink from "next/link";
import { Box, Button, Link as ChakraLink } from "@chakra-ui/react";
import { toEms } from "@/lib/helpers";

function SwiftMini() {
  return (
    <Box
      bg="transparent"
      outline="none"
      p={0}
      m={0}
      className="swiftMini"
      fontSize="1.5rem"
      color="red.600"
      transition="all 0.3s linear"
      _hover={{ letterSpacing: toEms(0.4), color: "red.700" }}
      asChild>
      <NextLink href="/?swift=home">Swift Mini</NextLink>
    </Box>
  );
}

export default SwiftMini;
