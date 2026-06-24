"use client";

import {
  Button,
  Center,
  Input,
  Stack,
  Text,
  Image,
  Field,
  Flex,
  Box,
  HStack,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import userOps from "@/graphql/operations/user.ops";
import Link from "next/link";

type AuthProps = {
  reloadSession: () => void;
  session: Session | null;
  children: React.ReactNode;
};

type CreateUsernameVariable = {
  username: string;
};

type CreateUsernameData = {
  createUsername: ApiReturn<string, "username">;
};

function Auth(props: AuthProps) {
  const { session, reloadSession, children } = props;
  const [Username, setUsername] = useState("");
  const [err, setErr] = useState(false); // input error
  const path = usePathname();

  const [createUsername, { loading }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariable
  >(userOps.Mutations.createUsername);

  async function onSubmit() {
    const username = Username.trim().toLowerCase();
    if (err || !username) return;

    toast.loading("loading", {
      id: "createusername"
    });

    try {
      const { data } = await createUsername({
        variables: { username }
      });

      if (!data?.createUsername) {
        throw new Error("Failed to create username");
      }

      if (!data.createUsername.success) {
        const { msg } = data.createUsername;
        return toast.error(msg, {
          id: "createusername"
        });
      }

      toast.success("Username created successfully", {
        id: "createusername"
      });

      reloadSession();
    } catch (error) {
      const e = error as unknown as { message: string };
      console.log(e.message);
      toast.error("Unknown error occured", {
        id: "createusername"
      });
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const regex = /[^A-Za-z0-9]/;
    if (e.target.value.match(regex)) {
      setErr(true);
    } else {
      setErr(false);
    }
    setUsername(e.target.value);
  }

  const imageUrl = session?.user?.image ? session.user.image : "/icon.png";

  return (
    <Flex gap={0} w={"100%"} margin={0} h={{ base: "", xmd: "100%" }}>
      <Center
        color="{colors.primaryText}"
        position="relative"
        width="100%"
        display={{
          base: acceptedPaths.includes(path) ? "none" : "flex",
          xmd: "flex"
        }}
        height="100vh">
        <Stack
          p={50}
          gap={7}
          width="95%"
          pos="relative"
          align="center"
          maxWidth="19.2rem"
          bg="{colors.secondaryBg}">
          <Image
            src={imageUrl}
            width="7rem"
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
                colorPalette="greenv"
                loading={loading}
                disabled={err}
                w="full"
                onClick={() => onSubmit()}>
                All Good
              </Button>
            </>
          ) : (
            <>
              <VStack gap={3} py={4}>
                <Text opacity={0.8}>You are not signed in</Text>
                <Button
                  py={2}
                  px={5}
                  fontSize={14}
                  onClick={() => signIn("google")}>
                  <Image
                    src="/google.png"
                    alt="Google Logo"
                    height={30}
                    width={30}
                  />{" "}
                  Continue with Google
                </Button>

                <Box
                  textDecoration="underline"
                  fontSize="small"
                  pos="absolute"
                  bottom="0.5rem"
                  color="gray.500">
                  <Link href="/privacy">Visit our privacy policy page</Link>
                </Box>
              </VStack>
            </>
          )}
        </Stack>
      </Center>

      {acceptedPaths.includes(path) && children}
    </Flex>
  );
}

export default Auth;

const acceptedPaths = ["/privacy"];
