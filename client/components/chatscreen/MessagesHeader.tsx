// import { useQuery } from "@apollo/client";
import { formatUserNames2 } from "@/lib";
import { ColorMode } from "@/lib/helpers";
import { LeftArrowIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";
// import chatOps from "@/graphql/operations/chats.ops";
import {
  Avatar,
  IconButton,
  Center,
  Flex,
  HStack,
  Text
} from "@chakra-ui/react";

type Props = {
  id: string; // this is chatId
  userId: string; // this is users ID
};

function MessagesHeader({ userId }: Props) {
  const router = useRouter();

  // recommended implementation
  // query for chat directly not all chats
  // const { data } = useQuery<chatsData>(chatOps.Queries.getChats);

  const { usernames, avatar, name } = formatUserNames2({} as ChatLean, userId);

  return (
    <HStack
      px={3}
      w="100%"
      h="60px"
      color="{colors.primaryText}"
      borderBottom="1px solid {colors.appBorder}"
      borderTopRadius="inherit">
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
          onClick={() => router.back()}
          minW="unset">
          <LeftArrowIcon color="{colors.primaryText}" />
        </IconButton>
      </Center>
    </HStack>
  );
}

export default MessagesHeader;
