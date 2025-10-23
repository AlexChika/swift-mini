"use client";

import {
  Box,
  Center,
  Stack,
  VStack,
  Image,
  Text,
  Button
} from "@chakra-ui/react";
import SwiftMini from "../home/SwiftMini";
import { useRouter } from "next/navigation";
import { useThemeValue } from "@/lib/helpers/color-mode";

function NotFound() {
  const router = useRouter();
  const notFoundSrc = useThemeValue("/404-light.png", "/404-dark.png");

  return (
    <Center h="100vh" px={5}>
      <Stack
        gap={{ base: 10, xmd: 4 }}
        alignItems="center"
        flexDir={{ base: "column", xmd: "row" }}
        border="2px solid redy">
        <Box flex="1" maxW="min(400px, 94%)">
          <Image
            pointerEvents="none"
            userSelect="none"
            draggable={false}
            src={notFoundSrc}
          />
        </Box>

        <Center flex="1">
          <VStack>
            <Text
              style={{ filter: "grayscale(100%)" }}
              textShadow={"1px 2px 2px #000"}
              color="#d1d1d1"
              fontSize={36}
              fontWeight={800}>
              O😔😔ps
            </Text>

            <Text
              maxW={"min(400px, 97%)"}
              fontWeight={600}
              mb={1}
              py={{ base: 4, xmd: 6 }}
              color="{colors.reversePrimaryText}"
              textAlign="center">
              <span style={{ opacity: 0.8 }}>
                We couldn't find the page you were looking for. Please check the
                URL and try again, or go back to &nbsp;
              </span>

              <br />
              <SwiftMini />
            </Text>

            <Button
              colorPalette="{colors.primaryText}"
              textTransform="capitalize"
              variant="surface"
              onClick={() => router.back()}>
              Take me to the previous page
            </Button>
          </VStack>
        </Center>
      </Stack>
    </Center>
  );
}

export default NotFound;
