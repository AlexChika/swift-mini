import { Session } from "next-auth";
import SwiftStore from "@/store/Store";
import CreateGroupPane from "./CreateGroupPane";
import React, { useCallback, useMemo, useState } from "react";
import { useThemeValue } from "@/lib/helpers/color-mode";
import { Text, Dialog, Portal, Box, HStack } from "@chakra-ui/react";
import NoChats from "@/components/allChats/CreateNewChatModal/NoChats";
import ModalBtn from "@/components/allChats/CreateNewChatModal/ModalBtn";
import UsersList from "@/components/allChats/CreateNewChatModal/UsersList";
import ModalHeader from "@/components/allChats/CreateNewChatModal/ModalHeader";
import { SeeMoreBtn } from "@/components/allChats/CreateNewChatModal/CreateNewChatModal";
import SearchUsersContactsPane from "@/components/allChats/CreateNewChatModal/SearchUsersPane/SearchUsersContactsPane";
import useNavigate from "@/lib/hooks/useNavigate";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session;
};

function CreateNewGroupModal({ isOpen, setIsOpen }: Props) {
  const { allChats } = SwiftStore();
  const { openChat } = useNavigate();

  const groupChats = useMemo(
    () => allChats.filter((chat) => chat.chatType === "group"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allChats.length]
  );

  function handleClick(id: string) {
    openChat(id);
    setIsOpen(false);
  }

  type UI_STATE = "default" | "createGroup" | "usersGroup";
  const [UIState, setUIState] = useState<UI_STATE>("default");
  const redColor = useThemeValue("red.600", "red.500");

  return (
    <Dialog.Root
      modal={false}
      open={isOpen}
      role="alertdialog"
      placement="center"
      onOpenChange={(e) => setIsOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            mx={2}
            pb={4}
            px={4}
            maxW="25rem"
            height="95dvh"
            bg="{colors.secondaryBg}"
            color="{colors.primaryText}"
            border={"1px solid {colors.appBorder}"}>
            <ModalHeader
              onClick={() => setUIState("default")}
              showBackBtn={UIState != "default"}
            />

            {/* create group. btn */}
            {UIState == "default" && (
              <ModalBtn
                onClick={() => setUIState("createGroup")}
                type="group"
              />
            )}

            {/* Default State Body of modal */}
            {UIState == "default" && (
              <Box h="calc(100% - 8rem)" mt={5}>
                <HStack justify="space-between">
                  <Text mb={1} opacity={0.6}>
                    Groups you are active in
                  </Text>
                  <SeeMoreBtn
                    onClick={() => setUIState("usersGroup")}
                    text="See all"
                    color={redColor}
                  />
                </HStack>

                {groupChats.length < 1 && (
                  <NoChats
                    mt={2}
                    customProps={{
                      type: "groups"
                    }}
                  />
                )}

                {groupChats.length > 0 && (
                  <UsersList
                    mt={2}
                    customProps={{
                      type: "group",
                      onClick: handleClick,
                      groupList: groupChats
                    }}
                    maxH="calc(100% - 2.5rem)"
                  />
                )}
              </Box>
            )}

            {/* Search pane state Body of modal  */}
            {UIState == "createGroup" && <CreateGroupPane />}
            {UIState == "usersGroup" && (
              <SearchUsersContactsPane type="group" />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default CreateNewGroupModal;
