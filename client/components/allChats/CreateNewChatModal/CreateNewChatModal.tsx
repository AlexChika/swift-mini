import {
  Button,
  Text,
  Dialog,
  Portal,
  Box,
  HStack,
  Icon,
  ButtonProps,
  Center
} from "@chakra-ui/react";

import NoChats from "./NoChats";
import ModalBtn from "./ModalBtn";
import UsersList from "./UsersList";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import ModalHeader from "./ModalHeader";
import { LeftArrowIcon } from "@/lib/icons";
import { useEvent } from "@/lib/hooks/useEvents";
import useNavigate from "@/lib/hooks/useNavigate";
import { useGetSwiftUsers } from "./useGetSwiftUsers";
import { useThemeValue } from "@/lib/helpers/color-mode";
import React, { useCallback, useMemo, useState } from "react";
import SearchSwiftUsersPane from "./SearchUsersPane/SearchSwiftUsersPane";
import SearchUsersContactsPane from "./SearchUsersPane/SearchUsersContactsPane";
import CreateGroupPane from "@/components/groups/CreateGroupPane/CreateGroupPane";
import { useGetRecentlyContacted } from "./useGetRecentlyContacted";
import chatOps from "@/graphql/operations/chat.ops";
import { useMutation } from "@apollo/client/react";
import Spinner from "@/components/general/Spinner";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session;
};

type UI_STATE = Swift.Create_Chats_UI_State;
type CreateDuoChatVariable = {
  otherUserId: string;
};

type CreateDuoChatData = {
  createDuoChat: ApiReturn<string, "chatId">;
};

function CreateNewChatModal({ isOpen, setIsOpen }: Props) {
  const [createDuoChat, { loading }] = useMutation<
    CreateDuoChatData,
    CreateDuoChatVariable
  >(chatOps.Mutations.createDuoChat);

  const [UIState, setUIState] = useState<UI_STATE>("default");
  const redColor = useThemeValue("red.600", "red.500");

  const { openChat } = useNavigate();
  const { dispatch } = useEvent("GROUP_UI_UPDATE");
  const recentChats = useGetRecentlyContacted();
  const { swiftUsers } = useGetSwiftUsers();

  function handleSetUIState(type: UI_STATE) {
    setUIState(type);
  }

  const modalTitle: Record<UI_STATE, string> = {
    swiftUsers: "Find Swift Users",
    createGroup: "Create New Group",
    default: "Find or Create New Chat",
    usersContact: "Your Swift Contacts",
    createGroupDetails: "Create New Group - Details",
    usersGroup: "Your Group Chats" // added for type compatibility
  };

  function headerOnClick() {
    setUIState((prev) => {
      let state = prev;
      if (prev == "swiftUsers") state = "default";
      if (prev == "usersContact") state = "default";
      else if (prev == "createGroup") state = "default";
      else if (prev == "createGroupDetails") state = "createGroup";
      dispatch(state);
      return state;
    });
  }

  const handleClick = useCallback(
    (_: string, opts?: { chatId?: string }) => {
      openChat(opts?.chatId || "");
      setIsOpen(false);
    },
    [openChat, setIsOpen]
  );

  const createNewChat = useCallback(
    async function (otherUserId: string) {
      try {
        const { data } = await createDuoChat({
          variables: { otherUserId }
        });

        const res = data?.createDuoChat;
        if (!res) throw new Error("Failed to create chat");

        if (res.success) {
          openChat(res.chatId);
          setIsOpen(false);
        } else return toast.error(res.msg, { id: "create chat" });
      } catch (error) {
        const e = error as unknown as { message: string; cause: string };
        toast.error("Unable to create chat", { id: "create chat" });
        console.log(e.message || e, "create new chat");
      }
    },
    [createDuoChat, openChat, setIsOpen]
  );

  const swiftUsersListProp = useMemo(() => {
    return {
      type: "user" as const,
      onClick: createNewChat,
      userList: swiftUsers as User[],
      emptyListText: "No users found"
    };
  }, [swiftUsers, createNewChat]);

  const recentUsersListProp = useMemo(() => {
    return {
      type: "user" as const,
      userList: recentChats,
      onClick: handleClick
    };
  }, [recentChats, handleClick]);

  return (
    <Dialog.Root
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
            pos="relative"
            bg="{colors.secondaryBg}"
            color="{colors.primaryText}"
            border={"1px solid {colors.appBorder}"}>
            <ModalHeader
              title={modalTitle[UIState]}
              onClick={headerOnClick}
              showBackBtn={UIState != "default"}
            />

            {/* search user buttons */}
            {UIState == "default" && (
              <>
                <ModalBtn
                  onClick={() => handleSetUIState("swiftUsers")}
                  type="chat"
                />
                <ModalBtn
                  onClick={() => handleSetUIState("createGroup")}
                  type="group"
                />
              </>
            )}

            {/* Default State Body of modal */}
            {UIState == "default" && (
              <Box
                h="70dvh"
                overflowY="auto"
                scrollbarWidth="none"
                border="2px solid redy">
                <Box mt={2}>
                  <HStack mb={2} justify="space-between">
                    <Text opacity={0.6}>Recently contacted</Text>
                    <SeeMoreBtn
                      onClick={() => handleSetUIState("usersContact")}
                      text="See all"
                      color={redColor}
                    />
                  </HStack>

                  {recentChats.length > 0 && (
                    <UsersList maxH="32dvh" customProps={recentUsersListProp} />
                  )}

                  {recentChats.length < 1 && <NoChats />}
                </Box>

                <Box mt={14}>
                  <HStack mb={2} justify="space-between">
                    <Text opacity={0.6}>Other people using swift</Text>

                    <SeeMoreBtn
                      onClick={() => handleSetUIState("swiftUsers")}
                      text="See more"
                      color={redColor}
                    />
                  </HStack>

                  <UsersList customProps={swiftUsersListProp} maxH="27dvh" />
                </Box>

                {loading && (
                  <Center
                    inset="0"
                    pos="absolute"
                    aria-busy="true"
                    userSelect="none"
                    cursor="not-allowed"
                    bg="{colors.secondaryBg/60}">
                    <Spinner />
                  </Center>
                )}
              </Box>
            )}

            {/* Search pane state Body of modal  */}
            {UIState == "swiftUsers" && (
              <SearchSwiftUsersPane setIsOpen={setIsOpen} />
            )}

            {UIState == "usersContact" && (
              <SearchUsersContactsPane setIsOpen={setIsOpen} type="user" />
            )}

            {UIState.includes("Group") && (
              <CreateGroupPane setUIState={setUIState} setIsOpen={setIsOpen} />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default CreateNewChatModal;

type SeeMoreBtnProp = {
  color?: ButtonProps["color"];
  text: string;
  onClick: () => void;
};

export function SeeMoreBtn(props: SeeMoreBtnProp) {
  const { color, text, onClick } = props;

  return (
    <Button
      p={0}
      h="auto"
      _hover={{
        scale: 0.97
      }}
      fontSize={13}
      color={color}
      variant="plain"
      onClick={onClick}>
      {text}
      <Icon style={{ rotate: "180deg" }}>
        <LeftArrowIcon style={{ width: "13px" }} />
      </Icon>
    </Button>
  );
}
