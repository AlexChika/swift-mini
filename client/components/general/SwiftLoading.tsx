import Spinner from "./Spinner";
import { Box, Image } from "@chakra-ui/react";

function SwiftLoading() {
  return (
    <Box pos="relative">
      {/* swift logo */}
      <Image maxW="200px" alt="Logo Image" src="/icon.png" />

      {/* loading spinner */}
      <Spinner absolute secondaryColor={"black"} />
    </Box>
  );
}

export default SwiftLoading;
