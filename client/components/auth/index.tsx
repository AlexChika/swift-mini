"use client";

import { Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

function Auth({ session, reloadSession }: AuthProps) {
  return (
    <Center position="relative" height="100vh">
      <Box
        position="absolute"
        top="20px"
        left="50%"
        transform="translateX(-50%)"
        mx="auto"
        bg="white"
        w="max-content"
        mt="20px"
        p="5px"
        rounded="10px"
      >
        <Image src="/icon.png" width={70} height={20} alt="swift logo" />
      </Box>

      <Stack align="center">
        {session ? (
          <Text>Create a username</Text>
        ) : (
          <>
            <Button
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
