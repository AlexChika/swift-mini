import { UserSearchIcon } from "@/lib/icons";
import { Box, Flex, Icon, Text, VStack, Avatar } from "@chakra-ui/react";
import { memo } from "react";

type CustomProp = {
  userList?: unknown[];
  emptyListText?: string;
};
type Prop = React.ComponentProps<typeof Box> & CustomProp;

function UsersList(prop: Prop) {
  const {
    p = 1,
    userList,
    h = "auto",
    maxH = "100%",
    emptyListText,
    borderRadius = 6,
    overflowY = "auto",
    bg = "transparent",
    scrollbarWidth = "none",
    border = "1px solid {colors.primaryText/20}",
    ...restProp
  } = prop;

  const list = userList || [];
  const isListEmpty = !userList || userList.length == 0;
  const text = emptyListText || "User you searched for was not found.";

  return (
    <Box
      p={p}
      h={h}
      bg={bg}
      maxH={maxH}
      overflowY={overflowY}
      borderRadius={borderRadius}
      scrollbarWidth={scrollbarWidth}
      border={isListEmpty ? "" : border}
      {...restProp}>
      {list.map((list, i) => (
        <User key={i} />
      ))}

      {isListEmpty && (
        <VStack
          border="1px dashed"
          gap={0}
          color="gray.500"
          justify="center"
          h="9rem">
          <Icon size="lg">
            <UserSearchIcon />
          </Icon>
          <Text>Ooops</Text>
          <Text mt={1}>{text}</Text>
        </VStack>
      )}
    </Box>
  );
}

export default memo(UsersList);

function User() {
  return (
    <Box
      px={2}
      py={2}
      _hover={{
        opacity: 0.6
      }}
      title={"name here"}
      color="primaryText"
      cursor="pointer"
      bg="transparent"
      transition="background-color 0.2s ease"
      onClick={() => console.log("fired a user")}
      border="1px solid transparent"
      borderBottom="1px solid {colors.primaryBg/15}">
      <Flex align="center" gap={2} justify="space-between">
        {/* avatar,  usernames, latest message */}
        <Flex truncate align="center" gap={2}>
          {/* user profile pic */}
          <Avatar.Root size="sm">
            <Avatar.Fallback name={"name"} />
            <Avatar.Image background="Highlight" src={undefined} />
          </Avatar.Root>

          {/* user names & latest message */}
          <Flex flexDir="column">
            {/* usernames */}
            <Text truncate fontSize={15}>
              {"usernames"}
            </Text>

            {/* latest messages */}
            <Text
              // opacity="90%"
              textOverflow="ellipsis"
              lineClamp={1}
              fontSize="11px">
              "body herere"
            </Text>
          </Flex>
        </Flex>

        {/* time passed */}
        <Text
          minW="80px"
          fontSize={11}
          opacity="70%"
          alignSelf="flex-end"
          textAlign="right">
          {"getTimePassed()"}
        </Text>
      </Flex>
    </Box>
  );
}
