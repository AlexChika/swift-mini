import {
  AIIcon,
  CallIcon,
  GearIcon,
  SearchIcon,
  ProfileIcon,
  AllChatIcon,
  DuoChatIcon,
  GroupChatIcon
} from "@/lib/icons";
import React from "react";
import { toRems } from "@/lib/helpers";
import { Box, Icon, Text, VStack, Button, Separator } from "@chakra-ui/react";

type Props = {
  param: Param;
  handleMenuClick: (param: Param) => void;
};

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
    icon: <SearchIcon />,
    label: "Search",
    aria: "search Chats and Messages",
    param: "search"
  },
  {
    icon: <AIIcon />,
    label: "AI Chat",
    aria: "list of AI Chats",
    param: "swiftAi"
  },
  {
    icon: <DuoChatIcon />,
    label: "Chats",
    aria: "list of Duo Chats",
    param: "duo"
  },

  {
    icon: <GroupChatIcon />,
    label: "Groups",
    aria: "lists of Groups Chats",
    param: "group"
  },
  {
    icon: <CallIcon />,
    label: "Calls",
    aria: "call history",
    param: "calls"
  }
];

function SideBar({ param, handleMenuClick }: Props) {
  return (
    <VStack
      py={4}
      px={2.5}
      h="100%"
      w={toRems(60)}
      justifyContent="space-between"
      display={{ base: "none", xmd: "flex" }}
      borderRight="1px solid {colors.appBorder}">
      <VStack alignItems="center">
        <Button variant="plain" p={0} m={0} h="auto">
          <Icon size="lg" color="gray">
            <ProfileIcon />
          </Icon>
        </Button>

        <Separator
          my={2}
          w={"100%"}
          colorPalette="{colors.appBorder}"
          size="sm"
        />

        <VStack alignItems="center">
          {footerButtons.map((btn) => {
            return (
              <React.Fragment key={btn.param}>
                {btn.param.includes("swiftAi") && (
                  <Separator
                    my={2}
                    size="sm"
                    w={"100%"}
                    colorPalette="{colors.appBorder}"
                  />
                )}

                <Button
                  onClick={() => handleMenuClick(btn.param)}
                  p={0}
                  mb={2}
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

                {btn.param.includes("swiftAi") && (
                  <Separator
                    my={2}
                    w={"100%"}
                    colorPalette="{colors.appBorder}"
                    size="sm"
                  />
                )}
              </React.Fragment>
            );
          })}
        </VStack>
      </VStack>

      {/* Settings button pushed to the bottom */}
      <Button
        title="Settings"
        onClick={() => handleMenuClick("settings")}
        p={0}
        variant="plain"
        aria-label="settings">
        <Icon
          color={param === "settings" ? "red.600" : "{colors.primaryText}"}
          size="lg">
          <GearIcon />
        </Icon>
      </Button>
    </VStack>
  );
}

export default SideBar;
