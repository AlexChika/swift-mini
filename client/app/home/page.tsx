"use client";

import { hideScrollbar } from "@/chakra/theme";
import { toEms, toRems } from "@/lib/helpers";
import useNavigate from "@/lib/hooks/useNavigate";
import { LeftArrowIcon } from "@/lib/icons";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Flex,
  Button,
  Image,
  Center
} from "@chakra-ui/react";

export default function HomePage() {
  const { openLink } = useNavigate();

  return (
    <Flex
      w="100%"
      direction="column"
      bg={{ base: "white", _dark: "black" }}
      color={{ base: "black", _dark: "white" }}
      borderLeft={{ xmd: "none" }}
      justifyContent="flex-start"
      xmd={{
        border: "4px solid",
        borderColor: { base: "red.600", _dark: "red.500" }
      }}
      borderLeftWidth={{ xmd: "0px" }}
      overflowY="auto"
      css={{
        margin: { base: "0px", xmd: toEms(5, 5, 5, 0) },
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" },
        ...hideScrollbar
      }}>
      {/* Hero Section */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        align="center"
        justify="space-between"
        p={{ base: 8, md: 16 }}
        minH="80vh"
        position="relative"
        overflow="hidden">
        {/* Glow effect */}
        <Box
          position="absolute"
          top="-20%"
          left="-10%"
          w="50%"
          h="50%"
          bg="red.500"
          filter="blur(150px)"
          opacity={{ base: 0.1, _dark: 0.15 }}
          zIndex={0}
        />

        <VStack align="flex-start" gap={6} maxW="xl" zIndex={1}>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="black"
            lineHeight="1.1"
            letterSpacing="tight">
            Chat Swiftly. <br />
            <Text as="span" color={{ base: "red.600", _dark: "red.500" }}>
              Think Deeply.
            </Text>
          </Heading>
          <Text
            fontSize="xl"
            color={{ base: "gray.600", _dark: "gray.300" }}
            maxW="lg">
            Experience the next generation of messaging with built-in AI tool
            execution, end-to-end privacy, and lightning-fast WebSockets.
          </Text>

          <Button
            size="lg"
            bg={{ base: "red.600", _dark: "red.500" }}
            color="white"
            px={8}
            py={6}
            mt={4}
            fontSize="lg"
            fontWeight="bold"
            borderRadius="full"
            _hover={{
              transform: "translateY(-2px)",
              bg: { base: "red.700", _dark: "red.600" },
              boxShadow: "lg"
            }}
            transition="all 0.2s"
            onClick={() => openLink("")}>
            Enter Swift Mini
          </Button>
        </VStack>

        {/* Floating Mockup */}
        <Box
          mt={{ base: 12, lg: 0 }}
          w="100%"
          maxW="md"
          zIndex={1}
          animation="pulse 4s infinite ease-in-out"
          css={{
            "@keyframes pulse": {
              "0%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-15px)" },
              "100%": { transform: "translateY(0)" }
            }
          }}>
          <Image
            src="/hero_mockup.png"
            alt="Swift Mini Chat Mockup"
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          />
        </Box>
      </Flex>

      {/* Features Bento Grid */}
      <Box
        p={{ base: 8, md: 16 }}
        bg={{ base: "gray.50", _dark: "gray.900" }}
        borderTop="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.800" }}>
        <Heading
          textAlign="center"
          mb={16}
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="black">
          Everything you need.{" "}
          <Text as="span" color={{ base: "red.600", _dark: "red.500" }}>
            Nothing you don't.
          </Text>
        </Heading>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
          {/* Smart AI Search - Span 2 Columns on LG */}
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              bg={{ base: "white", _dark: "black" }}
              borderRadius="2xl"
              p={8}
              h="100%"
              border="1px solid"
              borderColor={{ base: "red.100", _dark: "red.900" }}
              _hover={{
                borderColor: "red.500",
                transform: "translateY(-4px)",
                boxShadow: "xl"
              }}
              transition="all 0.3s"
              align="center"
              gap={8}>
              <VStack align="start" gap={4} flex={1}>
                <Heading
                  size="lg"
                  color={{ base: "red.600", _dark: "red.500" }}>
                  Agentic Search
                </Heading>
                <Text
                  fontSize="lg"
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  lineHeight="tall">
                  A sophisticated LLM-driven tool reasoning system natively
                  integrated. Ask for web lookups, generate PDFs, and compare
                  data right in your chat.
                </Text>
              </VStack>
              <Box flex={1} w="100%">
                <Image
                  src="/ai_mockup.png"
                  alt="AI Search"
                  borderRadius="xl"
                  boxShadow="md"
                />
              </Box>
            </Flex>
          </Box>

          {/* Privacy First */}
          <Box gridColumn={{ base: "span 1", lg: "span 1" }}>
            <VStack
              bg={{ base: "white", _dark: "black" }}
              borderRadius="2xl"
              p={8}
              h="100%"
              border="1px solid"
              borderColor={{ base: "red.100", _dark: "red.900" }}
              _hover={{
                borderColor: "red.500",
                transform: "translateY(-4px)",
                boxShadow: "xl"
              }}
              transition="all 0.3s"
              align="start"
              justify="center"
              gap={4}>
              <Box p={4} bg="red.500" borderRadius="xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </Box>
              <Heading size="lg">Privacy First</Heading>
              <Text
                fontSize="md"
                color={{ base: "gray.600", _dark: "gray.300" }}
                lineHeight="tall">
                MongoDB storage, upcoming End-to-End encryption, and a strict
                zero-AI-training policy. Your data is yours alone.
              </Text>
            </VStack>
          </Box>

          {/* Core Messaging */}
          <Box gridColumn={{ base: "span 1", lg: "span 1" }}>
            <VStack
              bg={{ base: "white", _dark: "black" }}
              borderRadius="2xl"
              p={8}
              h="100%"
              border="1px solid"
              borderColor={{ base: "red.100", _dark: "red.900" }}
              _hover={{
                borderColor: "red.500",
                transform: "translateY(-4px)",
                boxShadow: "xl"
              }}
              transition="all 0.3s"
              align="start"
              justify="center"
              gap={4}>
              <Box p={4} bg="red.500" borderRadius="xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </Box>
              <Heading size="lg">Core Messaging</Heading>
              <Text
                fontSize="md"
                color={{ base: "gray.600", _dark: "gray.300" }}
                lineHeight="tall">
                Lightning-fast WebSockets for real-time 1:1 and group chats with
                complete message history syncing.
              </Text>
            </VStack>
          </Box>

          {/* Advanced Capabilities - Span 2 */}
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <Flex
              direction={{ base: "column-reverse", md: "row" }}
              bg={{ base: "white", _dark: "black" }}
              borderRadius="2xl"
              p={8}
              h="100%"
              border="1px solid"
              borderColor={{ base: "red.100", _dark: "red.900" }}
              _hover={{
                borderColor: "red.500",
                transform: "translateY(-4px)",
                boxShadow: "xl"
              }}
              transition="all 0.3s"
              align="center"
              gap={8}>
              <Box flex={1} w="100%" maxW="xs">
                <Image
                  src="/mobile_mockup.png"
                  alt="Mobile UI"
                  borderRadius="xl"
                  boxShadow="md"
                />
              </Box>
              <VStack align="start" gap={4} flex={1}>
                <Heading
                  size="lg"
                  color={{ base: "red.600", _dark: "red.500" }}>
                  Advanced Capabilities
                </Heading>
                <Text
                  fontSize="lg"
                  color={{ base: "gray.600", _dark: "gray.300" }}
                  lineHeight="tall">
                  Typing indicators, read receipts, rich media sharing, and push
                  notifications. Built to scale perfectly across web and mobile
                  experiences.
                </Text>
              </VStack>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>

      {/* CTA Footer */}
      <Center
        py={{ base: 16, md: 24 }}
        px={8}
        bg={{ base: "white", _dark: "black" }}
        flexDir="column"
        textAlign="center">
        <Heading size="2xl" mb={6} fontWeight="black">
          Ready to chat?
        </Heading>
        <Text
          fontSize="lg"
          color={{ base: "gray.600", _dark: "gray.400" }}
          maxW="md"
          mb={10}>
          Join Swift Mini today and experience a faster, smarter, and more
          private way to connect with others.
        </Text>
        <Button
          bg="transparent"
          onClick={() => openLink("")}
          border="2px solid"
          borderColor="red.500"
          color={{ base: "red.600", _dark: "red.400" }}
          px={8}
          py={6}
          borderRadius="full"
          fontSize="lg"
          _hover={{ bg: "red.500", color: "white" }}
          transition="all 0.3s">
          <Box
            display="inline-flex"
            gap={toRems(7)}
            alignItems="center"
            fontWeight="bold">
            <LeftArrowIcon /> Enter{" "}
            <Text as="span" className="swiftMini">
              Swift Mini
            </Text>
          </Box>
        </Button>
      </Center>
    </Flex>
  );
}
