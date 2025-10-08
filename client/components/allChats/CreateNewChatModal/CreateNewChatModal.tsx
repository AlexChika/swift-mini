import {
  Stack,
  Button,
  Text,
  Avatar,
  Flex,
  IconButton,
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
import ModalHeader from "./ModalHeader";
import UsersList from "./UsersList";
import { useThemeValue } from "@/lib/helpers/color-mode";
import { LeftArrowIcon } from "@/lib/icons";
import SearchUsersBtn from "./SearchUsersBtn";
import SearchSwiftUsersPane from "./SearchUsersPane/SearchSwiftUsersPane";
import SearchUsersContactsPane from "./SearchUsersPane/SearchUsersContactsPane";

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
  const [username, setUsername] = React.useState("");
  const [participants, setParticipants] = React.useState<SearchedUser[]>([]);

  const [searchUsers, { loading, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariable
  >(userOps.Queries.searchUsers);

  const [createDuoChat, { loading: createConversationLoading }] = useMutation<
    CreateDuoChatData,
    CreateDuoChatVariable
  >(chatOps.Mutations.createDuoChat);

  function addParticipant(user: SearchedUser) {
    const userExist = participants.find((p) => p.id === user.id);
    if (userExist) return;

    setUsername("");
    setParticipants((prev) => [...prev, user]);
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }

  const { openChat } = useNavigate();
  async function onCreateConversation() {
    const otherUserId = participants[0]?.id;
    try {
      const { data } = await createDuoChat({
        variables: { otherUserId }
      });

      const { chatId } = data?.createDuoChat || {};
      console.log({ chatId });

      if (!chatId) throw new Error("Failed to create conversation");

      setParticipants([]);
      setUsername("");
      setIsOpen(false);
      openChat(chatId);
    } catch (error) {
      const e = error as unknown as { message: string };
      toast.error(e?.message, {
        id: "create conversation"
      });
    }
  }

  type UI_STATE = "default" | "swiftUsers" | "usersContact";
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
                <SearchUsersBtn
                  onClick={() => handleSetUIState("swiftUsers")}
                  type="chat"
                />
                <SearchUsersBtn type="group" />
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
                  <UsersList maxH="27dvh" />
                </Box>
              </Box>
            )}

            {/* Search pane state Body of modal  */}
            {UIState == "swiftUsers" && <SearchSwiftUsersPane />}
            {UIState == "usersContact" && <SearchUsersContactsPane />}

            {/*
           *
           *
           Search Result List */}
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}

            {/*
           *
           *
           Selected users {participants}*/}
            {participants.length > 0 && (
              <>
                <SelectedParticipants
                  removeParticipant={removeParticipant}
                  participants={participants}
                />
                <Button
                  loading={createConversationLoading}
                  onClick={() => onCreateConversation()}
                  w="100%"
                  mt={6}
                  colorScheme="blue">
                  Create Conversation
                </Button>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/*
 *
 */
type ListProp = {
  users: SearchedUser[];
  addParticipant: (user: SearchedUser) => void;
};
function UserSearchList({ users, addParticipant }: ListProp) {
  if (users.length < 1)
    return (
      <Text mt={5} textAlign="center" fontSize="14px" color="whiteAlpha.500">
        No user found
      </Text>
    );

  return (
    <Stack mt={3}>
      {users.map((user) => {
        return (
          <Stack
            key={user.id}
            direction="row"
            align="center"
            gap={4}
            py={2}
            px={2}
            borderRadius={4}
            _hover={{ bg: "whiteAlpha.200" }}>
            <Avatar.Root size={"sm"} variant="solid">
              <Avatar.Fallback name={user.username} />
            </Avatar.Root>
            <Flex align="center" justify="space-between" w="100%">
              <Text>{user.username}</Text>
              <Button
                size="sm"
                onClick={() => addParticipant(user)}
                colorScheme="blue"
                variant="outline">
                Select
              </Button>
            </Flex>
          </Stack>
        );
      })}
    </Stack>
  );
}

/*
 *
 */
type ParticipantsProps = {
  participants: SearchedUser[];
  removeParticipant: (id: string) => void;
};
function SelectedParticipants({
  participants,
  removeParticipant
}: ParticipantsProps) {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((p) => {
        return (
          <Stack
            bg="whiteAlpha.200"
            borderRadius={4}
            p={2}
            align="center"
            key={p.id}
            direction="row">
            <Text>{p.username}</Text>
            <IconButton
              onClick={() => removeParticipant(p.id)}
              variant="plain"
              aria-label="delete selected user button">
              <CloseIcon color="white" />
            </IconButton>
          </Stack>
        );
      })}
    </Flex>
  );
}

export default CreateNewChatModal;

type SeeMoreBtnProp = {
  color?: ButtonProps["color"];
  text: string;
  onClick: () => void;
};

function SeeMoreBtn(props: SeeMoreBtnProp) {
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
