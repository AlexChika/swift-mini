import Spinner from "./Spinner";
import { Box, Center, Image } from "@chakra-ui/react";

function SwiftLoading() {
  return (
    <Box pos="relative">
      {/* swift logo */}
      <Image maxW="200px" alt="Logo Image" src="/icon.png" />

      {/* loading spinner */}
      <Center pos="absolute" right="calc(50% + 5px)" top="calc(50% + 18px)">
        <Spinner borderWidth="5px" color="black" size="lg" />
      </Center>
    </Box>
  );
}

export default SwiftLoading;
