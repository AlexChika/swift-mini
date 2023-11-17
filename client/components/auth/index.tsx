"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

function Auth({ session, reloadSession }: AuthProps) {
  const [username, setUsername] = useState("");

  function onSubmit() {
    console.log({ username });
  }

  return (
    <Center position="relative" height="100vh">
      <Stack
        bg="whiteAlpha.100"
        border="1px slid grey"
        p={30}
        spacing={5}
        align="center"
      >
        <Image src="/icon.png" width={75} height={15} alt="swift logo" />

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
