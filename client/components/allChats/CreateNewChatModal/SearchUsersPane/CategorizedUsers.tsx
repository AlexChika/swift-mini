import UsersList from "../UsersList";
import Spinner from "@/components/general/Spinner";
import { Avatar, Box, Center, HStack } from "@chakra-ui/react";
import { memo, useEffect, useState, useTransition } from "react";

type Props = {
  userClick: (id: string) => void;
} & (
  | {
      type: "user";
      list: User[];
    }
  | {
      type: "group";
      list: ChatLean[];
    }
);

function CategorizedUsers({ userClick, type, list }: Props) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      requestIdleCallback(() => {
        if (type === "group")
          setCategories(
            categorizeUserAlphabetically({ type, groupList: list })
          );
        else if (type === "user")
          setCategories(categorizeUserAlphabetically({ type, userList: list }));
      });
    });
  }, [list, type]);

  if (isPending || !categories) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return categories.map((category) => {
    const { alphabet, userList, groupList } = category;
    return (
      <Box mb={7} key={alphabet}>
        <HStack mb={1.5}>
          <Avatar.Root shape="rounded" size="sm">
            <Avatar.Fallback colorInterpolation="auto" name={alphabet} />
          </Avatar.Root>
        </HStack>

        <UsersList
          customProps={
            type === "group"
              ? {
                  groupList,
                  type: "group",
                  onClick: userClick
                }
              : {
                  userList,
                  type: "user",
                  onClick: userClick
                }
          }
          bg="{colors.primaryBg/20}"
        />
      </Box>
    );
  });
}

export default memo(CategorizedUsers);

type Category = {
  alphabet: string;
  userList: User[];
  groupList: ChatLean[];
};

type Opts =
  | {
      type: "user";
      userList: User[];
    }
  | {
      type: "group";
      groupList: ChatLean[];
    };

function categorizeUserAlphabetically(opts: Opts) {
  const { type } = opts;
  const categories: Record<string, Category> = {};

  if (type === "group") {
    for (const group of opts.groupList) {
      const alphabet = group.chatName[0].toLowerCase() ?? "#";
      if (!categories[alphabet]) {
        categories[alphabet] = { alphabet, groupList: [group], userList: [] };
      } else {
        categories[alphabet].groupList.push(group);
      }
    }
  }

  // here we are grouping into categories
  if (type === "user") {
    for (const user of opts.userList) {
      const alphabet = user.username?.[0]?.toLowerCase() ?? "#";
      if (!categories[alphabet]) {
        categories[alphabet] = { alphabet, userList: [user], groupList: [] };
      } else {
        categories[alphabet].userList.push(user);
      }
    }
  }

  // and we are sorting
  return Object.values(categories)
    .sort((a, b) => a.alphabet.localeCompare(b.alphabet))
    .map((c) => ({
      ...c,
      userList: c.userList.sort((a, b) =>
        a.username!.localeCompare(b.username!)
      ),
      groupList: c.groupList.sort((a, b) =>
        a.chatName!.localeCompare(b.chatName!)
      )
    }));
}
