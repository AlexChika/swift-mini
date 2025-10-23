import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Avatar,
  BoxProps
} from "@chakra-ui/react";
import { memo } from "react";
import { UserSearchIcon } from "@/lib/icons";

type Prop = BoxProps & {
  customProps: {
    emptyListText?: string;
    onClick?: (id: string) => void;
  } & (
    | {
        type: "user";
        userList: User[];
      }
    | {
        type: "group";
        groupList: ChatLean[];
      }
  );
};

function UsersList(prop: Prop) {
  const { customProps, ...boxProps } = prop;

  const { type, onClick, emptyListText } = customProps;

  const isListEmpty =
    (type == "user" ? customProps.userList : customProps.groupList).length < 1;
  const text =
    emptyListText || type == "user"
      ? "User you searched for was not found."
      : "Group you searched for was not found.";

  function dummy() {
    console.log("fired a dummy @ UserList");
  }

  return (
    <Box
      {...boxProps}
      p={boxProps.p || 1}
      h={boxProps.h || "auto"}
      bg={boxProps.bg || "transparent"}
      maxH={boxProps.maxH || "100%"}
      overflowY={boxProps.overflowY || "auto"}
      borderRadius={boxProps.borderRadius || 6}
      scrollbarWidth={boxProps.scrollbarWidth || "none"}
      border={
        boxProps.border || isListEmpty
          ? ""
          : "1px solid {colors.primaryText/20}"
      }>
      {type == "user" &&
        customProps.userList?.map((user) => (
          <User
            type="user"
            onClick={onClick || dummy}
            user={user}
            key={user.id}
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

type UserProp = {
  onClick: (id: string) => void;
} & (
  | {
      type: "user";
      user: User;
    }
  | {
      type: "group";
      chat: ChatLean;
    }
);

function User(props: UserProp) {
  const { onClick, type } = props;

  let name: string;
  let username: string;
  let id: string;
  let image: string | undefined;

  if (type == "user") {
    name = props.user.name || "";
    username = props.user.username || "";

    // chatId for existing user search, id - used to create new chat
    // @ts-expect-error : Todo create a type for the return of this func and sync across all associated coponent
    id = props.user.chatId || props.user.id;
    image =
      props.user.permanentImageUrl ??
      props.user.userImageUrl ??
      props.user.image ??
      undefined;
  }

  if (type == "group") {
    name = props.chat.description;
    username = props.chat.chatName;
    id = props.chat.id;
    image = undefined;
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
      onClick(id);
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
      title={"name here"}
      color="primaryText"
      cursor="pointer"
      bg="transparent"
      transition="background-color 0.2s ease"
      onClick={clickHandler}
      border="1px solid transparent"
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
      </Flex>
    </Box>
  );
}
