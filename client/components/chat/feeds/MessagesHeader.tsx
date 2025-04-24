import { formatUserNames } from "@/lib";
import {
  Avatar,
  Box,
  IconButton,
  Center,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import conversationOperations from "@/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LeftArrowIcon } from "@/lib/icons";
import { ColorMode } from "@/lib/helpers";

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
    <HStack
      px={3}
      w="100%"
      h="60px"
      // bg="{colors.otherUserTextBg}"
      bg="{colors.secondaryBg2}"
      color="{colors.primaryText}"
      borderTopRadius="inherit"
    >
      {/* Back button for small screens  */}

      {/* latest message sender username and avatar */}
      <Flex align="center" py={4} h="100%" gap={2}>
        <Avatar.Root size="sm">
          <Avatar.Fallback />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <Text fontSize={16}>{name}</Text>
        <Text fontSize={16}>{"to:"}</Text>
      </Flex>

      {/* Rest of participants usernames */}
      <Center h="100%" truncate py={4}>
        <Text fontSize={14} truncate>
          {usernames}
        </Text>
      </Center>

      {/* action buttons */}
      <Center gap={2} h="100%" ml="auto">
        <ColorMode.ThemeButton />

        <IconButton
          display={{ base: "flex", xmd: "none" }}
          variant="plain"
          onClick={() => router.replace("/")}
          minW="unset"
        >
          <LeftArrowIcon color="{colors.primaryText}" />
        </IconButton>
      </Center>
    </HStack>
  );
}

export default MessagesHeader;
