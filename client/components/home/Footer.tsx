import {
  AIIcon,
  AllChatIcon,
  CallsIcon,
  DuoChatIcon,
  GroupChatIcon
} from "@/lib/icons";
import { toRems } from "@/lib/helpers";
import { Box, HStack, Button, Icon, Text } from "@chakra-ui/react";

const footerButtons: {
  icon: React.ReactNode;
  label: string;
  aria: string;
  param: Param;
}[] = [
  {
    icon: <AllChatIcon />,
    label: "All Chats",
    aria: "list of all Chats",
    param: "home"
  },
  {
    icon: <DuoChatIcon />,
    label: "Chats",
    aria: "list of Duo Chats",
    param: "duo"
  },
  {
    icon: <AIIcon />,
    label: "AI Chat",
    aria: "list of AI Chats",
    param: "swiftAi"
  },
  {
    icon: <GroupChatIcon />,
    label: "Groups",
    aria: "lists of Groups Chats",
    param: "group"
  },
  {
    icon: <CallsIcon />,
    label: "Calls",
    aria: "call history",
    param: "calls"
  }
];

type Props = {
  param: Param;
  handleMenuClick: (param: Param) => void;
};

function Footer({ param, handleMenuClick }: Props) {
  return (
    <Box
      w="100%"
      borderTop="1px solid {colors.appBorder}"
      display={{ base: "block", xmd: "none" }}
      alignSelf="flex-end"
      minH={toRems(62)}
      h={toRems(62)}>
      <HStack
        px={2.5}
        h="100%"
        justifyContent="space-between"
        alignItems="center">
        {footerButtons.map((btn) => {
          return (
            <Button
              onClick={() => handleMenuClick(btn.param)}
              key={btn.param}
              p={0}
              variant="plain"
              aria-label={btn.aria}>
              <Box
                color={
                  param === btn.param ? "red.600" : "{colors.primaryText}"
                }>
                <Icon size="md">{btn.icon}</Icon>
                <Text opacity={0.7} fontSize={12}>
                  {btn.label}
                </Text>
              </Box>
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}

export default Footer;
