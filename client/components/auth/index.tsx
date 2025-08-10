"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  Center,
  Input,
  Stack,
  Text,
  Image,
  Field
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";

import userOperations from "@/graphql/operations/users";
import toast from "react-hot-toast";

type AuthProps = {
  reloadSession: () => void;
  session: Session | null;
};

function Auth({ session, reloadSession }: AuthProps) {
  const [Username, setUsername] = useState("");
  const [err, setErr] = useState(false); // input error

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariable
  >(userOperations.Mutations.createUsername);

  async function onSubmit() {
    const username = Username.trim().toLowerCase();
    if (err || !username) return;

    toast.loading("loading", {
      id: "createusername"
    });

    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error("Operation failed");
      }

      if (!data?.createUsername.success) {
        const { error } = data.createUsername;
        throw new Error(error);
      }

      toast.success("Username created successfully", {
        id: "createusername"
      });
      reloadSession();
    } catch (error) {
      const e = error as unknown as { message: string };
      toast.error(e?.message || "Unknown error occured", {
        id: "createusername"
      });
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const regex = /[^A-Za-z0-9]/;
    e.target.value.match(regex) ? setErr(true) : setErr(false);
    setUsername(e.target.value);
  }

  const imageUrl = session?.user?.image ? session.user.image : "/icon.png";

  return (
    <Center color="{colors.primaryText}" position="relative" height="100vh">
      <Stack
        width="95%"
        maxWidth="19.2rem"
        bg="{colors.secondaryBg}"
        p={30}
        gap={5}
        align="center">
        <Image
          src={imageUrl}
          width="70px"
          alt="user image"
          rounded={session?.user?.image ? "100%" : ""}
        />

        {session ? (
          <>
            <Text
              fontWeight={900}
              fontSize="1.125rem"
              lineClamp={1}
              textAlign="center"
              mb={-5}>
              Hi, 👋 {session?.user.name}
            </Text>

            <Text opacity={0.8}>Create a username</Text>

            <Field.Root invalid={err}>
              <Input
                bg="{colors.primaryBg}/20"
                color="{colors.primaryText}"
                borderColor={err ? "red" : "{colors.primaryBg}"}
                padding={2}
                onChange={(e) => onChange(e)}
                value={Username}
                placeholder="Enter a username"
              />

              <Field.ErrorText textAlign="justify">
                Invalid username, use only letters and numbers
              </Field.ErrorText>
            </Field.Root>

            <Button
              color="{colors.primaryText}"
              bg="{colors.primaryBg}"
              loading={loading}
              disabled={err}
              w="full"
              onClick={() => onSubmit()}>
              All Good
            </Button>
          </>
        ) : (
          <>
            <Text opacity={0.8}>You are not signed in</Text>
            <Button padding={2} fontSize={14} onClick={() => signIn("google")}>
              <Image
                src="/google.png"
                alt="Google Logo"
                height={30}
                width={30}
              />{" "}
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default Auth;
