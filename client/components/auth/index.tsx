"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Center, Input, Stack, Text, Image } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";

import userOperations from "@/graphql/operations/users";

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

function Auth({ session, reloadSession }: AuthProps) {
  const [username, setUsername] = useState("");
  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameReturn,
    CreateUsernameVariable
  >(userOperations.Mutations.createUsername);

  async function onSubmit() {
    if (!username) return;

    try {
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log(error);
    }

    console.log({ username });
  }

  return (
    <Center position="relative" height="100vh">
      <Stack bg="whiteAlpha.100" p={30} spacing={5} align="center">
        <Image src="/icon.png" width="75px" alt="swift logo" />

        {session ? (
          <>
            <Text noOfLines={1} textAlign="center" mb={-5}>
              Hi {session?.user.name}
            </Text>
            <Text>Create a username</Text>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Enter a username"
            />
            <Button fontSize={14} w="full" onClick={onSubmit}>
              All Good
            </Button>
          </>
        ) : (
          <>
            <Text>You are not signed in</Text>
            <Button
              fontSize={14}
              onClick={() => signIn("google")}
              leftIcon={
                <Image
                  src="/google.png"
                  alt="Google Logo"
                  height={30}
                  width={30}
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default Auth;
