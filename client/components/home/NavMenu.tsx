import { HStack, Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { DotsVerticalIcon, GearIcon, ProfileIcon } from "@/lib/icons";

type Props = {
  handleMenuClick: (param: Param) => void;
};

function NavMenu({ handleMenuClick }: Props) {
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
                <HStack justifyContent="space-between">
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
                <HStack justifyContent="space-between">
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
