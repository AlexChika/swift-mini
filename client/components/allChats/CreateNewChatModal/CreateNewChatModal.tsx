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
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import CloseIcon from "@/lib/icons/CloseIcon";
import useNavigate from "@/lib/hooks/useNavigate";
import userOps from "@/graphql/operations/user.ops";
import chatOps from "@/graphql/operations/chat.ops";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import ModalBtn from "./ModalBtn";
import UsersList from "./UsersList";
import ModalHeader from "./ModalHeader";
import { LeftArrowIcon } from "@/lib/icons";
import { useThemeValue } from "@/lib/helpers/color-mode";
import SearchSwiftUsersPane from "./SearchUsersPane/SearchSwiftUsersPane";
import SearchUsersContactsPane from "./SearchUsersPane/SearchUsersContactsPane";
import CreateGroupPane from "@/components/groups/CreateNewGroupModal/CreateGroupPane";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session;
};

type CreateDuoChatVariable = {
  otherUserId: string;
};

type CreateDuoChatData = {
  createDuoChat: {
    chatId: string;
  };
};

function CreateNewChatModal({ isOpen, setIsOpen }: Props) {
  // const [username, setUsername] = React.useState("");
  // const [participants, setParticipants] = React.useState<SearchedUser[]>([]);

  // const [searchUsers, { loading, data }] = useLazyQuery<
  //   SearchUsersData,
  //   SearchUsersVariable
  // >(userOps.Queries.searchUsers);

  // const [createDuoChat, { loading: createConversationLoading }] = useMutation<
  //   CreateDuoChatData,
  //   CreateDuoChatVariable
  // >(chatOps.Mutations.createDuoChat);

  // const { openChat } = useNavigate();
  // async function onCreateConversation() {
  //   const otherUserId = participants[0]?.id;
  //   try {
  //     const { data } = await createDuoChat({
  //       variables: { otherUserId }
  //     });

  //     const { chatId } = data?.createDuoChat || {};
  //     console.log({ chatId });

  //     if (!chatId) throw new Error("Failed to create conversation");

  //     setParticipants([]);
  //     setUsername("");
  //     setIsOpen(false);
  //     openChat(chatId);
  //   } catch (error) {
  //     const e = error as unknown as { message: string };
  //     toast.error(e?.message, {
  //       id: "create conversation"
  //     });
  //   }
  // }

  type UI_STATE = "default" | "swiftUsers" | "usersContact" | "createGroup";
  const [UIState, setUIState] = useState<UI_STATE>("default");
  const redColor = useThemeValue("red.600", "red.500");

  function handleSetUIState(type: UI_STATE) {
    setUIState(type);
  }

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
            bg="{colors.secondaryBg}"
            color="{colors.primaryText}"
            border={"1px solid {colors.appBorder}"}>
            <ModalHeader
              onClick={() => handleSetUIState("default")}
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
                  <HStack justify="space-between">
                    <Text mb={1} opacity={0.6}>
                      Recently contacted
                    </Text>
                    <SeeMoreBtn
                      onClick={() => handleSetUIState("usersContact")}
                      text="See all"
                      color={redColor}
                    />
                  </HStack>
                  {/* <UsersList maxH="32dvh" /> if recent users  */}
                  <Center
                    h="9rem"
                    flexDir="column"
                    color="gray.500"
                    border="1px dashed">
                    <Text>You are yet to add any contacts</Text>
                    <Text opacity={0.7} mt={1} fontSize={13} textAlign="center">
                      When a swift user accepts your message invite, they
                      automatically are added to your contact list
                    </Text>
                  </Center>
                </Box>

                <Box mt={14}>
                  <HStack justify="space-between">
                    <Text mb={1} opacity={0.6}>
                      Other people using swift
                    </Text>

                    <SeeMoreBtn
                      onClick={() => handleSetUIState("swiftUsers")}
                      text="See more"
                      color={redColor}
                    />
                  </HStack>
                  <UsersList
                    customProps={{ type: "user", userList: [] }}
                    maxH="27dvh"
                  />
                </Box>
              </Box>
            )}

            {/* Search pane state Body of modal  */}
            {UIState == "createGroup" && <CreateGroupPane />}
            {UIState == "swiftUsers" && <SearchSwiftUsersPane />}
            {UIState == "usersContact" && (
              <SearchUsersContactsPane type="user" />
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
