import {
  AIIcon,
  CallsIcon,
  GearIcon,
  SearchIcon,
  ProfileIcon,
  AllChatIcon,
  DuoChatIcon,
  GroupChatIcon
} from "@/lib/icons";
import React from "react";
import { toRems, truthy } from "@/lib/helpers";
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
    icon: <CallsIcon />,
    label: "Calls",
    aria: "call history",
    param: "calls"
  }
];

function SideBar({ param, handleMenuClick }: Props) {
  const color = (p: Param) =>
    truthy(param, p, "red.600", "{colors.primaryText}");

  return (
    <VStack
      py={4}
      px={2.5}
      h="100%"
      w={toRems(65)}
      justifyContent="space-between"
      display={{ base: "none", xmd: "flex" }}
      borderRight="1px solid {colors.appBorder}">
      <VStack alignItems="center">
        <Button
          h="auto"
          variant="plain"
          title="Profile"
          onClick={() => handleMenuClick("profile")}>
          <Icon size="lg" color="gray">
            <ProfileIcon />
          </Icon>
        </Button>

        <Separator
          my={2}
          w={toRems(55)}
          colorPalette="{colors.appBorder}"
          size="md"
        />

        {/* every other sidebar icon */}
        <VStack alignItems="center">
          {footerButtons.map((btn) => {
            return (
              <React.Fragment key={btn.param}>
                {btn.param.includes("swiftAi") && (
                  <Separator
                    mb={3}
                    size="md"
                    w={toRems(55)}
                    colorPalette="{colors.appBorder}"
                  />
                )}

                <Button
                  onClick={() => handleMenuClick(btn.param)}
                  mb={3}
                  variant="plain"
                  aria-label={btn.aria}>
                  <Box color={color(btn.param)}>
                    <Icon size="md">{btn.icon}</Icon>
                    <Text opacity={0.7} fontSize={12}>
                      {btn.label}
                    </Text>
                  </Box>
                </Button>

                {btn.param.includes("swiftAi") && (
                  <Separator
                    mb={3}
                    w={toRems(55)}
                    colorPalette="{colors.appBorder}"
                    size="md"
                  />
                )}
              </React.Fragment>
            );
          })}
        </VStack>
      </VStack>

      {/* Settings button pushed to the bottom */}
      <VStack>
        <Separator
          my={2}
          w={toRems(55)}
          colorPalette="{colors.appBorder}"
          size="md"
        />

        <Button
          title="Settings"
          onClick={() => handleMenuClick("settings")}
          variant="plain"
          aria-label="settings">
          <Icon color={color("settings")} size="lg">
            <GearIcon />
          </Icon>
        </Button>
      </VStack>
    </VStack>
  );
}

export default SideBar;
