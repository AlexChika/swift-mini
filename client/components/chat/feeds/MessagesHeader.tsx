import { formatUserNames } from "@/lib";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

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
  return (
    <Flex
      h="65px"
      bg="whiteAlpha.50"
      mb={50}
      // border="2px"
      borderBottomColor="whiteAlpha.50"
    >
      {/* Back button for small screens  */}
      <Box></Box>

      {/* latest message sender username and avatar */}
      <Flex bg="blackAlpha.200" align="center" px={3} py={4} h="100%" gap={2}>
        <Avatar src={avatar} size="sm" />
        <Text ml={2}>{name}</Text>
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
