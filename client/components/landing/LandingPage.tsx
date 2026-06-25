"use client";

import { useEffect, useRef, useState } from "react";
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

function ScrollReveal({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.17 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      opacity={isVisible ? 1 : 0}
      transform={isVisible ? "translateY(0)" : "translateY(40px)"}
      transition={`all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`}
      h="100%">
      {children}
    </Box>
  );
}

export default function LandingPage() {
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
        p={{ base: 4, sm: 8, md: 16 }}
        minH="80vh"
        position="relative"
        overflow="hidden">
        {/* Glow effect */}
        <Box
          className="red"
          position="absolute"
          top="-20%"
          left="-10%"
          w="55%"
          h="55%"
          bg="red.500"
          filter={`blur(${toRems(150)})`}
          opacity={{ base: 0.15, _dark: 0.18 }}
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
            onClick={() => openLink("login")}>
            Enter Swift Mini
          </Button>
        </VStack>

        {/* Floating Mockup */}
        <Box
          mt={{ base: 12, lg: 0 }}
          w="100%"
          maxW="md"
          zIndex={1}
          animation="float 8s infinite ease-in-out">
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

      {/* Infinite Marquee Carousel */}
      <Box
        w="99%"
        overflow="hidden"
        bg={{ base: "white", _dark: "black" }}
        py={12}
        m="0 auto"
        borderTop="2px solid"
        borderBottom="1px solid"
        css={{
          "& .marquee-track": {
            _hover: {
              animationPlayState: "paused"
            }
          }
        }}
        borderColor={{ base: "gray.200", _dark: "gray.800" }}>
        <Flex
          className="marquee-track"
          w="fit-content"
          animation="scrollMarquee 40s linear infinite"
          gap={8}>
          <Flex gap={8} align="center" px={4}>
            {[...appSnaps, ...appSnaps].map((src, idx) => (
              <Image
                key={`${src}-${idx}`}
                src={src}
                alt="App Showcase"
                h={{ base: toRems(200), md: toRems(350) }}
                w="auto"
                borderRadius="xl"
                boxShadow="xl"
                border="1px solid"
                borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                objectFit="contain"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
              />
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* Features Bento Grid */}
      <Box
        mb={10}
        px={{ base: 4, sm: 8, md: 16 }}
        bg={{ base: "gray.100", _dark: "gray.900" }}
        borderTop="1px solid"
        borderColor={{ base: "gray.200", _dark: "gray.800" }}>
        <Heading
          textAlign="center"
          py={16}
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="black">
          Everything you need.{" "}
          <Text as="span" color={{ base: "red.600", _dark: "red.500" }}>
            Nothing you don't.
          </Text>
        </Heading>

        <SimpleGrid mb={16} columns={{ base: 1, lg: 3 }} gap={8}>
          {/* Smart AI Search - Span 2 Columns on LG */}
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <ScrollReveal delay={0}>
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
            </ScrollReveal>
          </Box>

          {/* Privacy First */}
          <Box gridColumn={{ base: "span 1", lg: "span 1" }}>
            <ScrollReveal delay={0.1}>
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
            </ScrollReveal>
          </Box>

          {/* Core Messaging */}
          <Box gridColumn={{ base: "span 1", lg: "span 1" }}>
            <ScrollReveal delay={0.2}>
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
                  Lightning-fast WebSockets for real-time 1:1 and group chats
                  with complete message history syncing.
                </Text>
              </VStack>
            </ScrollReveal>
          </Box>

          {/* Advanced Capabilities - Span 2 */}
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <ScrollReveal delay={0.3}>
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
                    Typing indicators, read receipts, rich media sharing, and
                    push notifications. Built to scale perfectly across web and
                    mobile experiences.
                  </Text>
                </VStack>
              </Flex>
            </ScrollReveal>
          </Box>
        </SimpleGrid>
      </Box>

      {/* CTA Footer */}
      <Center
        px={8}
        flexDir="column"
        textAlign="center"
        py={{ base: 16, md: 24 }}
        bg={{ base: "white", _dark: "black" }}>
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
          onClick={() => openLink("login")}
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

const appSnaps = [
  "/hero_mockup.png",
  "/ai_mockup.png",
  "/mobile_mockup.png",
  "/hero_mockup.png"
];
