import useFetchConversation from "@/lib/hooks/useFetchConversation";
import { Image } from "@chakra-ui/react";
import {
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from "@chakra-ui/react";
import Spinner from "../general/Spinner";

type Props = {
  Child: JSX.Element;
};

function StartScreen({ Child }: Props) {
  // initialize / fetch all queries for caching
  const { data, error } = useFetchConversation();

  if (data) return Child;

  if (error)
    return (
      <Center h="100vh">
        <Alert
          bg="transparent"
          color="whiteAlpha.500"
          status="error"
          flexDirection="column"
          textAlign="center"
        >
          <AlertIcon color="whiteAlpha.500" boxSize="40px" mr={0} />
          <AlertTitle mt={4} fontSize="sm">
            Something Went Wrong!
          </AlertTitle>
          <AlertDescription fontSize="small" maxWidth="sm">
            Please Refresh The browser
          </AlertDescription>
        </Alert>
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
        textColor="gray"
      >
        Loading Please Wait...
      </Text>
    </Center>
  );
}

export default StartScreen;
