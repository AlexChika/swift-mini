import {
  Box,
  Text,
  Image,
  Input,
  VStack,
  Button,
  Center,
  Spinner,
  Checkmark,
  Separator,
  RadioGroup,
  Collapsible
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CaretIcon } from "@/lib/icons";
import { useEvent } from "@/lib/hooks/useEvents";
import useNavigate from "@/lib/hooks/useNavigate";
import { useMutation } from "@apollo/client/react";
import chatOps from "@/graphql/operations/chat.ops";
import UsersList from "@/components/allChats/CreateNewChatModal/UsersList";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  nextStep: (goto: boolean | number) => void;
};

type CreateGroupChatVariable = {
  description: string;
  chatName: string;
  groupType: "private" | "public";
  memberIds: string[];
  avatar: string;
};

type CreateGroupChatData = {
  createGroupChat: ApiReturn<string, "chatId">;
};

function GroupDetailsStep(props: Props) {
  const { setIsOpen, nextStep } = props;
  const { openChat } = useNavigate();

  // states
  const [info, setInfo] = useState({
    groupName: "",
    isPrivate: false,
    groupDescription: "",
    groupAvatar: ""
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // events & hooks
  useEvent("GROUP_UI_UPDATE", (payload) => {
    if (payload.data === "createGroup") nextStep(false);
  });

  useEvent("GROUP_SELECTED_USERS", (payload) => {
    setSelectedUsers(payload.data);
  });

  const [createGroupChat, { loading }] = useMutation<
    CreateGroupChatData,
    CreateGroupChatVariable
  >(chatOps.Mutations.createGroupChat);

  // functions
  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  }

  function pickImage(e: React.MouseEvent<HTMLButtonElement>) {
    const input = e.currentTarget.parentElement?.querySelector(
      "input"
    ) as HTMLInputElement;
    if (!input) return;
    input.click();
  }

  function imagehandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 3;
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > maxBytes) {
      alert(`File too large! Max size is ${MAX_SIZE_MB}MB`);
      return;
    }

    const reader = new FileReader();
    const handleLoad = () => {
      setInfo((prev) => ({
        ...prev,
        groupAvatar: reader.result as string
      }));
      reader.removeEventListener("load", handleLoad);
    };

    reader.addEventListener("load", handleLoad);
    reader.readAsDataURL(file);
  }

  function validateProgress(name: keyof typeof info | "selectedMembers") {
    if (name === "selectedMembers") {
      const valid = selectedUsers.length > 0;
      return {
        msg: `${selectedUsers.length} member(s) selected`,
        color: valid ? "green" : "red",
        title: "Selected Members",
        valid,
        value: selectedUsers.length
      };
    }

    if (name === "isPrivate") {
      const valid = true;
      const value = info[name];

      return {
        title: "Make Group Private",
        msg: value ? "This group will be private" : "This group will be public",
        valid,
        value,
        color: "green"
      };
    }

    // handle groupName, groupDescription, groupProfilePic together
    const value = info[name].trim();
    const valid = value.length > 3;
    const color = valid ? "green" : "red";

    const map = {
      groupName: {
        title: "Group Name",
        msg: valid
          ? `Your group name is: ${value}`
          : value.length < 1
            ? "You have not added a Group Name"
            : "Name must be at least 4 characters"
      },
      groupDescription: {
        title: "Group Description",
        msg: valid
          ? `Your group desc is: ${value}`
          : value.length < 1
            ? "You have not added a description"
            : "Must be at least 4 characters"
      },
      groupAvatar: {
        title: "Group Avatar",
        msg: valid
          ? `You have added a group avatar`
          : "You have not added a group avatar"
      }
    };

    return { valid, value, color, ...map[name] };
  }

  function sumOfValidProgress() {
    let sum = 0;
    fillProgress.forEach((progress) => {
      const { valid } = validateProgress(progress);
      if (valid) sum++;
    });
    const color =
      sum === fillProgress.length
        ? "green"
        : sum > fillProgress.length / 2
          ? "orange"
          : "red";

    return { sum, color, total: fillProgress.length };
  }

  // constants
  const fillProgress: (keyof typeof info | "selectedMembers")[] = [
    "selectedMembers",
    "isPrivate",
    "groupName",
    "groupDescription",
    "groupAvatar"
  ];

  const { color, sum, total } = sumOfValidProgress();

  async function handleCreateGroup() {
    if (sum < total) return;

    try {
      const { data } = await createGroupChat({
        variables: {
          chatName: info.groupName,
          avatar: info.groupAvatar,
          description: info.groupDescription,
          groupType: info.isPrivate ? "private" : "public",
          memberIds: selectedUsers.map((s) => s.id)
        }
      });

      const res = data?.createGroupChat;
      if (!res) throw new Error("Unable to create group chat");

      if (res.success) {
        openChat(res.chatId);
        setIsOpen(false);
      } else throw new Error(res.msg, { cause: res.msg });
    } catch (error) {
      const e = error as unknown as { message: string; cause: string };
      toast.error(e.message || e.cause || "Unable to create group chat", {
        id: "create group chat"
      });
      console.log(e.message || "Unable to create group chat");
    }
  }

  return (
    <Box>
      {/* Group Profile Picture */}
      <Center>
        <VStack
          alignItems="center"
          justify="center"
          rounded="50%"
          pos="relative"
          border="1px solid {colors.primaryText/50}"
          w="6rem"
          h="6rem">
          <Box zIndex={1} pos="relative" mt={2}>
            <input
              hidden
              type="file"
              accept="image/*"
              name="groupProfilePic"
              onChange={imagehandler}
            />

            <Button
              textShadow="1px 1px 5px {colors.reversePrimaryText/70}, -1px -1px 5px {colors.reversePrimaryText/70}, 1px -1px 5px {colors.reversePrimaryText/70}, -1px 1px 5px {colors.reversePrimaryText/70}"
              bg={info.groupAvatar && "none"}
              onClick={pickImage}
              variant="subtle"
              colorPalette={"white"}
              size="xs">
              Upload file
            </Button>
          </Box>

          {info.groupAvatar && (
            <Image
              fit="cover"
              pos="absolute"
              aspectRatio={1}
              src={info.groupAvatar}
              borderRadius="50%"
              alt="Group Profile Picture"
            />
          )}
        </VStack>
      </Center>

      {/* Group Name */}
      <Center mt={2}>
        <Input
          w="90%"
          border="none"
          name="groupName"
          textAlign="center"
          autoComplete="off"
          value={info.groupName}
          onChange={onChangeHandler}
          placeholder="Tap to add Group Name"
        />
      </Center>

      {/* Group Description */}
      <Center flexDir="column" mt={2}>
        <Input
          w="90%"
          maxH="5lh"
          maxLength={500}
          border="none"
          variant="outline"
          textAlign="center"
          autoComplete="off"
          name="groupDescription"
          onChange={onChangeHandler}
          value={info.groupDescription}
          placeholder="Tap to add a brief Group description"></Input>
      </Center>

      {/* Make group private toggle */}
      <Button
        w="xs"
        mt={2}
        gap={5}
        mx="auto"
        display="flex"
        variant="plain"
        alignItems="center"
        opacity={info.isPrivate ? 1 : 0.5}
        onClick={() =>
          setInfo((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))
        }>
        <Text>Make Group Private </Text>
        <Checkmark
          checked={info.isPrivate}
          cursor="pointer"
          w="0.85rem"
          h="0.85rem"
          colorPalette="black"
        />
      </Button>

      <Separator my={5} />

      {/* Deatils filled progress */}
      <Collapsible.Root>
        <Collapsible.Trigger
          paddingY="3"
          display="flex"
          mx="auto"
          justifyContent="space-between"
          gap="2"
          alignItems="center">
          <Text
            textAlign="center"
            color="gray.400"
            _dark={{ color: "gray.600" }}>
            <Text fontSize={13} color={color} as="span">
              {sum}/{total}
            </Text>{" "}
            Finish setting up your group
          </Text>

          <Collapsible.Indicator
            rotate="270deg"
            transition="transform 0.2s"
            _open={{ transform: "rotate(-90deg)" }}>
            <CaretIcon />
          </Collapsible.Indicator>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <Box>
            {fillProgress.map((progress, i) => {
              const { color, msg, title } = validateProgress(progress);

              return (
                <RadioGroup.Root
                  key={i}
                  size="xs"
                  value="true"
                  colorPalette={color}>
                  <RadioGroup.Item maxW="100%" flexWrap="nowrap" value="true">
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText truncate>
                      <Text fontSize={13} opacity={0.7} as="span">
                        {title} -
                      </Text>
                      &nbsp;
                      <Text truncate as="span">
                        {msg}
                      </Text>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                </RadioGroup.Root>
              );
            })}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      <Separator my={5} />

      {/* Selected members */}
      <Collapsible.Root>
        <Collapsible.Trigger
          paddingY="3"
          display="flex"
          mx="auto"
          justifyContent="space-between"
          gap="2"
          alignItems="center">
          <Text
            textAlign="center"
            color="gray.400"
            _dark={{ color: "gray.600" }}>
            <Text fontSize={13} color="green" as="span">
              {selectedUsers.length}
            </Text>{" "}
            Member(s) Selected
          </Text>

          <Collapsible.Indicator
            rotate="270deg"
            transition="transform 0.2s"
            _open={{ transform: "rotate(-90deg)" }}>
            <CaretIcon />
          </Collapsible.Indicator>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <Box>
            <UsersList
              customProps={{ type: "user", userList: selectedUsers }}
            />
            <Text
              fontSize={11}
              mt={2}
              textAlign="center"
              color="gray.400"
              _dark={{ color: "gray.600" }}>
              You can add more members to your group later
            </Text>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* create group button */}
      <Button
        mt={5}
        w="100%"
        _hover={{
          letterSpacing: "wider"
        }}
        colorPalette="teal"
        disabled={sum < total}
        onClick={handleCreateGroup}>
        {sum === total ? "Create Group" : "Finish Setting up your Group"}
      </Button>

      {/* craeting group loading overlay */}
      {loading && (
        <Center
          inset="0"
          zIndex={20}
          pos="absolute"
          aria-busy="true"
          userSelect="none"
          cursor="not-allowed"
          bg="{colors.secondaryBg/60}">
          <Spinner />
        </Center>
      )}
    </Box>
  );
}

export default GroupDetailsStep;
