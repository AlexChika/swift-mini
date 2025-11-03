import { Session } from "next-auth";
import SwiftStore from "@/store/Store";
import useNavigate from "@/lib/hooks/useNavigate";
import { useThemeValue } from "@/lib/helpers/color-mode";
import React, { useCallback, useMemo, useState } from "react";
import CreateGroupPane from "./CreateGroupPane/CreateGroupPane";
import { Text, Dialog, Portal, Box, HStack } from "@chakra-ui/react";
import NoChats from "@/components/allChats/CreateNewChatModal/NoChats";
import ModalBtn from "@/components/allChats/CreateNewChatModal/ModalBtn";
import UsersList from "@/components/allChats/CreateNewChatModal/UsersList";
import ModalHeader from "@/components/allChats/CreateNewChatModal/ModalHeader";
import { SeeMoreBtn } from "@/components/allChats/CreateNewChatModal/CreateNewChatModal";
import SearchUsersContactsPane from "@/components/allChats/CreateNewChatModal/SearchUsersPane/SearchUsersContactsPane";
import { useEvent } from "@/lib/hooks/useEvents";

type Props = {
  isOpen: boolean;
  session: Session;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type UI_STATE = Swift.Create_Chats_UI_State;

function CreateNewGroupModal({ isOpen, setIsOpen }: Props) {
  const { allChats } = SwiftStore();
  const { openChat } = useNavigate();
  const { dispatch } = useEvent("GROUP_UI_UPDATE");

  const groupChats = useMemo(
    () => allChats.filter((chat) => chat.chatType === "group"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allChats.length]
  );

  const handleClick = useCallback(
    (id: string) => {
      openChat(id);
      setIsOpen(false);
    },
    [openChat, setIsOpen]
  );

  const [UIState, setUIState] = useState<UI_STATE>("default");
  const redColor = useThemeValue("red.600", "red.500");

  const modalTitle: Record<UI_STATE, string> = {
    usersGroup: "Your Group Chats",
    createGroup: "Create New Group",
    default: "Find or Create New Group",
    createGroupDetails: "Create New Group - Details",
    swiftUsers: "Find Swift Users", // added for type compatibility
    usersContact: "Your Swift Contacts" // added for type compatibility
  };

  function headerOnClick() {
    setUIState((prev) => {
      let state = prev;
      if (prev == "usersGroup") state = "default";
      else if (prev == "createGroupDetails") state = "createGroup";
      else if (prev == "createGroup") state = "default";
      dispatch(state);
      return state;
    });
  }

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
              onClick={headerOnClick}
              title={modalTitle[UIState]}
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

            {UIState == "usersGroup" && (
              <SearchUsersContactsPane setIsOpen={setIsOpen} type="group" />
            )}

            {/* Search pane state Body of modal  */}
            {UIState.includes("create") && (
              <CreateGroupPane setUIState={setUIState} setIsOpen={setIsOpen} />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default CreateNewGroupModal;
