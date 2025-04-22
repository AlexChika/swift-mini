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
  Field,
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
      id: "createusername",
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
        id: "createusername",
      });
      reloadSession();
    } catch (error) {
      const e = error as unknown as { message: string };
      toast.error(e?.message || "Unknown error occured", {
        id: "createusername",
      });
    }
  }

  const imageUrl = session
    ? session?.user?.image
      ? session.user.image
      : "/icon.png"
    : "/icon.png";

  return (
    <Center position="relative" height="100vh">
      <Stack bg="whiteAlpha.100" p={30} gap={5} align="center">
        <Image
          src={imageUrl}
          width="70px"
          alt="swift logo"
          rounded={session?.user?.image ? "100%" : ""}
        />

        {session ? (
          <>
            <Text fontSize="14px" lineClamp={1} textAlign="center" mb={-5}>
              Hi {session?.user.name}
            </Text>
            <Text>Create a username</Text>

            <Field.Root invalid={err}>
              <Input placeholder="Enter a username" />
              <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>
            <Input
              css={{ "--error-color": "red.600" }}
              onChange={(e) => {
                const regex = /[^A-Za-z0-9]/;
                e.target.value.match(regex) ? setErr(true) : setErr(false);
                setUsername(e.target.value);
              }}
              value={Username}
              placeholder="Enter a username"
            />
            <Button
              loading={loading}
              disabled={err}
              fontSize={14}
              w="full"
              onClick={onSubmit}
            >
              All Good
            </Button>
          </>
        ) : (
          <>
            <Text>You are not signed in</Text>
            <Button fontSize={14} onClick={() => signIn("google")}>
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
