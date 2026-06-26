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
  VStack
} from "@chakra-ui/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { loginParticles } from "./loginParticle";
import useNavigate from "@/lib/hooks/useNavigate";
import { useMutation } from "@apollo/client/react";
import userOps from "@/graphql/operations/user.ops";
import { NextParticles } from "@tsparticles/nextjs";
import { signIn, useSession } from "next-auth/react";

type CreateUsernameVariable = {
  username: string;
};

type CreateUsernameData = {
  createUsername: ApiReturn<string, "username">;
};

function Login() {
  const { openLink } = useNavigate();
  const [err, setErr] = useState(false);
  const [Username, setUsername] = useState("");
  const { data: session, update } = useSession();

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

      update();
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

  useEffect(() => {
    if (session?.user.username) openLink("");
  }, [openLink, session?.user.username]);

  if (session?.user.username) return "";

  return (
    <Flex pos="relative" margin={0} h="100%">
      {/* Overlay Bg */}
      <NextParticles
        style={{
          position: "absolute",
          inset: "0"
        }}
        id="login-particles"
        options={loginParticles}
      />

      {/* auth / login modal */}
      <Center
        zIndex={2}
        color="{colors.primaryText}"
        position="relative"
        width="100%">
        <Stack
          py={50}
          px={10}
          gap={4}
          width="95%"
          pos="relative"
          align="center"
          maxWidth="19.2rem"
          bg="{colors.secondaryBg}">
          <VStack mb={5}>
            <Image
              src={imageUrl}
              width="7rem"
              alt="user image"
              rounded={session?.user?.image ? "100%" : ""}
            />
            {!session && (
              <Text fontSize="small" color="gray.400" textAlign="center">
                Chat Swiftly with friends and in groups.
              </Text>
            )}
          </VStack>
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
                <Text opacity={0.8}>You are not signed in.</Text>
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
    </Flex>
  );
}

export default Login;
