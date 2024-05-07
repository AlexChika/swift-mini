import { formatUserNames } from "@/lib";
import { Avatar, Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LeftArrowIcon } from "@/lib/icons";

type Props = {
  id: string; // this is conversationId
  userId: string; // this is users ID
};

function MessagesHeader({ id, userId }: Props) {
  const router = useRouter();

  const { data, loading } = useQuery<conversationsData>(
    conversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find((c) => c.id === id);

  if (data?.conversations && !loading && !conversation) {
    router.replace("/");
  }

  const { usernames, avatar, name } = formatUserNames(
    conversation?.participants || [],
    userId,
    "long"
  );

  // bg = "whiteAlpha.50";
  return (
    <Flex
      h="60px"
      bg="blackAlpha.300"
      borderBottom="2px"
      borderColor="whiteAlpha.50"
    >
      {/* Back button for small screens  */}
      <Center display={{ base: "flex", xmd: "none" }} bg="blackAlpha.200">
        <Button onClick={() => router.replace("/")} minW="unset" bg="none">
          <LeftArrowIcon color="whiteAlpha.500" />
        </Button>
      </Center>

      {/* latest message sender username and avatar */}
      <Flex align="center" mx={{ base: 3, xmd: 4 }} py={4} h="100%" gap={2}>
        <Avatar src={avatar} size="sm" />
        <Text>{name}</Text>
        <Text color="gray.500">{"to:"}</Text>
      </Flex>

      {/* Rest of participants usernames */}
      <Flex isTruncated align="center" px={3} py={4}>
        <Text fontSize={14} color="gray.500" isTruncated>
          {usernames}
        </Text>
      </Flex>

      {/* action buttons */}
      <Box></Box>
    </Flex>
  );
}

export default MessagesHeader;
