"use client";

import { LeftArrowIcon } from "@/lib/icons";
import { toEms, toRems } from "@/lib/helpers";
import { hideScrollbar } from "@/chakra/theme";
import useNavigate from "@/lib/hooks/useNavigate";
import { Box, Heading, Text, VStack, Flex, Button } from "@chakra-ui/react";

export default function PrivacyPage() {
  const { openLink } = useNavigate();

  return (
    <Flex
      w="100%"
      direction="column"
      bg="{colors.secondaryBg}"
      justifyContent="space-between"
      borderLeft={{ xmd: "none" }}
      xmd={{ border: "4px solid {colors.appBorder}" }}
      borderLeftWidth={{ xmd: "0px" }}
      overflowY="auto"
      css={{
        margin: { base: "0px", xmd: toEms(5, 5, 5, 0) },
        borderRadius: { base: "0px", xmd: "0px 10px 10px 0px" },
        ...hideScrollbar
      }}>
      <Box h="100%" p={{ base: 6, md: 10 }}>
        <VStack align="start" gap={8}>
          <Box textAlign="center" mb={4} w="100%">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              fontWeight="extrabold"
              letterSpacing="tight">
              Privacy Policy
            </Heading>
            <Text fontSize="lg" color="{colors.usernameColor}">
              Your data is yours. We believe in absolute transparency and
              minimal data collection.
            </Text>
          </Box>

          <Box css={{ containerType: "inline-size" }} w="100%">
            <Box
              display="grid"
              gap={8}
              w="100%"
              css={{
                gridTemplateColumns: "1fr",
                [`@container (min-width: ${toRems(550)})`]: {
                  gridTemplateColumns: "repeat(2, 1fr)"
                }
              }}>
              {/* Data Collection */}
              <Box
                p={6}
                borderRadius="xl"
                bg="{colors.otherUserTextBg}"
                border="1px solid {colors.messageBorder}"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
                <Heading as="h3" size="md" mb={3} color="grey">
                  Google Authentication
                </Heading>
                <Text lineHeight="tall">
                  When you sign in using Google Auth, we only collect your{" "}
                  <strong>Name</strong> and <strong>Email Address</strong>. We
                  do not request or access your contacts, drive, or any other
                  personal information.
                </Text>
              </Box>

              {/* Storage */}
              <Box
                p={6}
                borderRadius="xl"
                bg="{colors.userTextBg}"
                border="1px solid {colors.messageBorder}"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
                <Heading as="h3" size="md" mb={3} color="grey">
                  Data Storage
                </Heading>
                <Text lineHeight="tall">
                  Your chats and messages are securely stored in a{" "}
                  <strong>MongoDB</strong> database. We are actively working on
                  implementing End-to-End Encryption, which is coming very soon
                  to ensure ultimate privacy.
                </Text>
              </Box>

              {/* No AI */}
              <Box
                p={6}
                borderRadius="xl"
                bg="{colors.userTextBg}"
                border="1px solid {colors.messageBorder}"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
                <Heading as="h3" size="md" mb={3} color="grey">
                  No AI Training
                </Heading>
                <Text lineHeight="tall">
                  Your conversations are strictly private. No data is ever
                  shared with AI models, and no chats are fed into machine
                  learning algorithms or sold to third parties.
                </Text>
              </Box>

              {/* Complete Privacy */}
              <Box
                p={6}
                borderRadius="xl"
                bg="{colors.otherUserTextBg}"
                border="1px solid {colors.messageBorder}"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}>
                <Heading as="h3" size="md" mb={3} color="gray">
                  Total Confidentiality
                </Heading>
                <Text lineHeight="tall">
                  We do not sell your data to advertisers, data brokers, or the
                  government. Swift Mini is built from the ground up for
                  private, fast communication.
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Detailed Policy Sections */}
          <VStack align="start" gap={8} w="100%" mt={8}>
            <Box w="100%">
              <Heading as="h2" size="lg" mb={3} color="{colors.primaryText}">
                1. Information We Do Not Collect
              </Heading>
              <Text lineHeight="tall" color="{colors.usernameColor}">
                We believe that the best way to protect your privacy is to
                collect as little data as possible. We do not track your
                location, we do not monitor your device fingerprint, and we do
                not collect usage telemetry for third-party advertisers.
              </Text>
            </Box>

            <Box w="100%">
              <Heading as="h2" size="lg" mb={3} color="{colors.primaryText}">
                2. Cookies and Tracking Technologies
              </Heading>
              <Text lineHeight="tall" color="{colors.usernameColor}">
                Swift Mini uses only essential session cookies required to keep
                you authenticated and to ensure the core functionality of the
                real-time chat application. We do not use third-party tracking
                cookies or advertising pixels.
              </Text>
            </Box>

            <Box w="100%">
              <Heading as="h2" size="lg" mb={3} color="{colors.primaryText}">
                3. Data Retention and Deletion
              </Heading>
              <Text lineHeight="tall" color="{colors.usernameColor}">
                Your data is retained only for as long as your account is
                active. If you choose to delete your account, all associated
                messages, profile data, and metadata will be permanently
                expunged from our MongoDB servers within 30 days.
              </Text>
            </Box>

            <Box w="100%">
              <Heading as="h2" size="lg" mb={3} color="{colors.primaryText}">
                4. Your Rights
              </Heading>
              <Text lineHeight="tall" color="{colors.usernameColor}">
                Under applicable privacy laws (such as GDPR and CCPA), you have
                the right to access, rectify, or erase your personal data. You
                may export your chat history or request full account deletion at
                any time by contacting our support team or navigating to your
                account settings.
              </Text>
            </Box>

            <Box w="100%">
              <Heading as="h2" size="lg" mb={3} color="{colors.primaryText}">
                5. Changes to This Policy
              </Heading>
              <Text lineHeight="tall" color="{colors.usernameColor}">
                We may update this privacy policy occasionally to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the new policy on this page.
              </Text>
            </Box>
          </VStack>

          <Box
            py={8}
            w="100%"
            textAlign="center"
            alignSelf="center"
            borderTop="1px solid {colors.appBorder}">
            <Button bg="transparent" onClick={() => openLink("")}>
              <Box
                display="inline-flex"
                gap={toRems(7)}
                color="red.600"
                fontWeight="bold"
                fontSize="lg"
                transition="all 0.3s linear"
                _hover={{ letterSpacing: toEms(0.4), color: "red.700" }}>
                <LeftArrowIcon /> Return to
                <Text as="span" className="swiftMini">
                  Swift Mini
                </Text>
              </Box>
            </Button>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
