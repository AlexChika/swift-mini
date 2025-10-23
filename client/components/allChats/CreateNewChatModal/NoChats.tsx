import { Center, CenterProps, Text } from "@chakra-ui/react";

type Props = {
  customProps?: {
    type?: "chats" | "groups";
    header?: string;
    body?: string;
  };
} & CenterProps;

function NoChats(props: Props) {
  const { customProps, ...centerProps } = props;
  let { type, header, body } = customProps || {};
  type = type || "chats";
  header =
    header || type == "chats"
      ? "You are yet to add any contacts"
      : "You are yet to join any groups";
  body =
    body || type == "chats"
      ? "When a swift user accepts your message invite, they are automatically added to your contact list"
      : "Groups you have created or joined will appear here ";

  return (
    <Center
      h="9rem"
      flexDir="column"
      {...centerProps}
      color={centerProps.color || "gray.500"}
      border={centerProps.border || "1px dashed"}>
      <Text>{header}</Text>
      <Text opacity={0.7} mt={2} fontSize={13} textAlign="center">
        {body}
      </Text>
    </Center>
  );
}

export default NoChats;
