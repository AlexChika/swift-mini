import useFetchConversation from "@/lib/hooks/useFetchConversation";
import {
  Center,
  AspectRatio,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

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

  return (
    <Center opacity="0.6" flexDirection="column" h="100vh">
      <AspectRatio
        overflow="hidden"
        borderRadius="50%"
        w="100%"
        maxWidth="120px"
        ratio={1}
      >
        <video
          loop
          muted
          playsInline
          autoPlay={true}
          src="/clockloadingbg.mp4"
        />
      </AspectRatio>

      <Text mt={5}>Loading... Please wait </Text>
    </Center>
  );
}

export default StartScreen;
