import {
  Text,
  Flex,
  Avatar,
  VStack,
  FlexProps,
  CloseButton,
  Center
} from "@chakra-ui/react";

type Props = FlexProps & {
  selectedList: User[];
  emptyListText?: string;
  unselect: (id: string, opts?: { isTrusted: boolean }) => void;
};

function SelectedUsers(props: Props) {
  const { selectedList, emptyListText, unselect, ...flexProps } = props;
  const listIsEmpty = selectedList.length < 1;

  return (
    <Flex
      {...flexProps}
      border={listIsEmpty ? "" : flexProps.border || "transparent"}
      py={listIsEmpty ? "" : flexProps.py || 3}
      px={listIsEmpty ? "" : flexProps.px || 2}
      flexWrap="wrap">
      {selectedList.map((selected, i) => (
        <SelectedUser unselect={unselect} user={selected} key={i} />
      ))}

      {listIsEmpty && (
        <Center
          border="1px dashed"
          width="100%"
          gap={0}
          color="gray.500"
          h="4rem">
          <Text opacity={0.7}>You have not selected any users yet</Text>
        </Center>
      )}
    </Flex>
  );
}

export default SelectedUsers;

type SelectedProp = {
  user: User;
  unselect: (id: string, opts?: { isTrusted: boolean }) => void;
};

function SelectedUser(props: SelectedProp) {
  const { user, unselect } = props;

  const name = user.name || "name here";
  const username = user.username || "username here";

  const image =
    user.permanentImageUrl ?? user.userImageUrl ?? user.image ?? undefined;

  const colorPalette = ["purple", "blue", "green", "pink", "red", "black"];

  const pickPalette = (name: string) => {
    const index =
      name.split("").reduce((p, c) => p + c.charCodeAt(0), 0) %
      colorPalette.length;
    return colorPalette[index];
  };

  function dummy(id: string) {
    console.log("a dummy was doubred @ SelectedUser with " + id);
  }

  function handleClick(e: React.MouseEvent) {
    (unselect || dummy)(user.id, { isTrusted: e.isTrusted });
  }

  return (
    <VStack pos="relative" p={3} truncate align="center" gap={0}>
      {/* user profile pic */}
      <Avatar.Root shape="full" colorPalette={pickPalette(username!)} size="xs">
        <Avatar.Fallback name={name! || username!} />
        <Avatar.Image background="Highlight" src={image} />
      </Avatar.Root>

      {/* user names & latest message */}
      <Text textTransform="capitalize" truncate fontSize={12}>
        {username!}
      </Text>

      <CloseButton
        onClick={handleClick}
        opacity={0.7}
        color="{colors.primaryText}"
        right="0px"
        top="5px"
        pos="absolute"
        variant="plain"
        p={0}
        h="auto"
        size="xs"
      />
    </VStack>
  );
}
