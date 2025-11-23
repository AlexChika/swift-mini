import {
  Box,
  Flex,
  Text,
  VStack,
  Avatar,
  BoxProps,
  Checkbox
} from "@chakra-ui/react";
import { memo, useState } from "react";

type Prop = BoxProps & {
  customProps: {
    emptyListText?: string;
    checkMarks?: boolean;
    onClick?: (
      id: string,
      opts?: { isTrusted: boolean; chatId?: string }
    ) => void;
  } & (
    | {
        type: "user";
        userList: UserWithChatId[];
      }
    | {
        type: "group";
        groupList: ChatLean[];
      }
  );
};

function UsersList(prop: Prop) {
  const { customProps, ...boxProps } = prop;

  const { type, onClick, emptyListText, checkMarks } = customProps;

  const isListEmpty =
    (type == "user" ? customProps.userList : customProps.groupList).length < 1;

  function dummy() {
    console.log("fired a dummy @ UserList");
  }

  return (
    <Box
      {...boxProps}
      p={boxProps.p || 1}
      h={boxProps.h || "auto"}
      bg={isListEmpty ? "transparent" : boxProps.bg || "transparent"}
      maxH={boxProps.maxH || "100%"}
      overflowY={boxProps.overflowY || "auto"}
      borderRadius={boxProps.borderRadius || 6}
      scrollbarWidth={boxProps.scrollbarWidth || "none"}
      border={
        boxProps.border ||
        (isListEmpty ? "" : "1px solid {colors.primaryText/10}")
      }>
      {type == "user" &&
        customProps.userList?.map((user) => (
          <User
            type="user"
            user={user}
            key={user.id}
            checkMarks={checkMarks}
            onClick={onClick || dummy}
          />
        ))}

      {type == "group" &&
        customProps.groupList?.map((group) => (
          <User
            type="group"
            onClick={onClick || dummy}
            chat={group}
            key={group.id}
          />
        ))}

      {isListEmpty && (
        <VStack
          gap={0}
          h="8rem"
          px={3}
          justify="center"
          color="gray.500"
          border="1px dashed"
          bg={boxProps.bg || "transparent"}>
          <Text mb={0}>Ooops</Text>
          <Text fontSize={13} opacity={0.7} textAlign="center">
            {emptyListText ||
              (type == "user"
                ? "User you searched for was not found."
                : "Group you searched for was not found.")}
          </Text>
        </VStack>
      )}
    </Box>
  );
}

export default memo(UsersList);

type UserProp = {
  onClick: (id: string, opts?: { isTrusted: boolean; chatId?: string }) => void;
  checkMarks?: boolean;
} & (
  | {
      type: "user";
      user: UserWithChatId;
    }
  | {
      type: "group";
      chat: ChatLean;
    }
);

function User(props: UserProp) {
  const { onClick, type, checkMarks } = props;
  const [checked, setChecked] = useState(false);

  let name: string;
  let username: string;
  let id: string;
  let image: string | undefined;
  let chatId: string | undefined;

  if (type == "user") {
    name = props.user.name || "";
    username = props.user.username || "";
    id = props.user.id;
    chatId = props.user.chatId;
    image = props.user.permanentImageUrl ?? props.user.image ?? undefined;
  }

  if (type == "group") {
    name = props.chat.description;
    username = props.chat.chatName;
    id = props.chat.id;
    image = props.chat.avatar;
  }

  const colorPalette = ["purple", "blue", "green", "pink", "red", "black"];

  const pickPalette = (name: string) => {
    const index =
      name.split("").reduce((p, c) => p + c.charCodeAt(0), 0) %
      colorPalette.length;
    return colorPalette[index];
  };

  function clickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if ((e.target as HTMLDivElement).dataset.scope === "avatar") {
      // avatar was clicked, handle navigate to users profile
      console.log("clicked avatar");
    } else {
      onClick(id, { isTrusted: e.isTrusted, chatId });
      if (checkMarks) setChecked(!checked);
      // opene a newChat with the user
    }
  }

  return (
    <Box
      px={2}
      py={2}
      _hover={{
        opacity: 0.6
      }}
      cursor="pointer"
      bg="transparent"
      color="primaryText"
      data-swift-userlist-item={id!}
      onClick={clickHandler}
      title={name! || username!}
      border="1px solid transparent"
      transition="background-color 0.2s ease"
      borderBottom="1px solid {colors.primaryBg/15}">
      <Flex align="center" gap={2} justify="space-between">
        <Flex truncate align="center" gap={2}>
          {/* user profile pic */}
          <Avatar.Root
            shape={type == "user" ? "full" : "rounded"}
            colorPalette={pickPalette(username!)}
            size="md">
            <Avatar.Fallback
              opacity={0.7}
              name={type == "group" ? username! : name! || username!}
            />
            <Avatar.Image background="Highlight" src={image} />
          </Avatar.Root>

          {/* user names & latest message */}
          <Flex flexDir="column">
            {/* usernames */}
            <Text textTransform="capitalize" truncate fontSize={15}>
              {username!}
            </Text>

            {/* description / name */}
            <Text
              opacity="0.6"
              textOverflow="ellipsis"
              lineClamp={1}
              fontSize="11px">
              {name! || ""}
            </Text>
          </Flex>
        </Flex>

        {checkMarks && (
          <Checkbox.Root
            onClick={(e) => e.preventDefault()}
            checked={checked}
            onCheckedChange={(e) => setChecked(!!e.checked)}>
            <Checkbox.HiddenInput />
            <Checkbox.Control cursor="pointer" />
          </Checkbox.Root>
        )}
      </Flex>
    </Box>
  );
}
