import useFetchConversation from "@/lib/hooks/useFetchConversation";
import { Image } from "@chakra-ui/react";
import { Center, Alert, Text } from "@chakra-ui/react";
import Spinner from "../general/Spinner";

type Props = {
  Child: React.ReactNode;
};

function StartScreen({ Child }: Props) {
  // initialize / fetch all queries for caching
  const { data, error } = useFetchConversation();

  if (data) return Child;

  if (error)
    return (
      <Center h="100vh">
        <Alert.Root
          bg="transparent"
          color="whiteAlpha.500"
          status="error"
          flexDirection="column"
          textAlign="center"
        >
          <Alert.Indicator color="whiteAlpha.500" boxSize="40px" mr={0} />
          <Alert.Content>
            <Alert.Title mt={4} fontSize="sm">
              Something Went Wrong!
            </Alert.Title>
            <Alert.Description fontSize="small" maxWidth="sm">
              Please Refresh The browser
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Center>
    );

  // loading....
  return (
    <Center opacity="0.9" flexDirection="column" h="100vh">
      {/* swift logo */}
      <Image maxW="200px" alt="Logo Image" src="/icon.png" />

      {/* loading spinner */}
      <Spinner absolute secondaryColor={"black"} />

      <Text
        top="58%"
        pos="absolute"
        letterSpacing="2px"
        textAlign="center"
        fontStyle="italic"
        fontSize="13px"
        color="gray"
      >
        Loading Please Wait...
      </Text>
    </Center>
  );
}

export default StartScreen;
