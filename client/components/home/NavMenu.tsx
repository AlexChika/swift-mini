import { HStack, Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { DotsVerticalIcon, GearIcon, ProfileIcon } from "@/lib/icons";
import { truthy } from "@/lib/helpers";

type Props = {
  handleMenuClick: (param: Param) => void;
  pageName: PageName;
};

function NavMenu({ handleMenuClick, pageName }: Props) {
  const color = (p: PageName) =>
    truthy(pageName, p, "red.600", "{colors.primaryText}");

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <button aria-label="open menu">
          <Icon opacity={0.7} size="lg">
            <DotsVerticalIcon />
          </Icon>
        </button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item asChild value="profile">
              <button onClick={() => handleMenuClick("profile")}>
                <HStack color={color("Profile")} justifyContent="space-between">
                  <Icon size="md">
                    <ProfileIcon />
                  </Icon>
                  <Text ml={2} flex="1">
                    Profile
                  </Text>
                </HStack>
              </button>
            </Menu.Item>

            <Menu.Item value="settings">
              <button onClick={() => handleMenuClick("settings")}>
                <HStack
                  color={color("Settings")}
                  justifyContent="space-between">
                  <Icon size="md">
                    <GearIcon />
                  </Icon>
                  <Text ml={2} flex="1">
                    Settings
                  </Text>
                </HStack>
              </button>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default NavMenu;
