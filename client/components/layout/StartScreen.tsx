import useFetchChats from "@/lib/hooks/useFetchChats";
import { Image } from "@chakra-ui/react";
import { Center, Alert, Text } from "@chakra-ui/react";
import Spinner from "../general/Spinner";
import InitSwiftMini from "@/store/InitSwiftMini";

type Props = {
  Child: React.ReactNode;
};

function StartScreen({ Child }: Props) {
  // initialize / fetch all queries for caching
  const { data, error } = useFetchChats();
  InitSwiftMini();

  if (data) return Child;

  if (error)
    return (
      <Center h="100vh">
        <Alert.Root
          bg="{colors.secondaryBg}"
          color="{colors.primaryText}"
          status="error"
          textAlign="center"
          borderRadius="lg"
          border="1px solid"
          borderColor="#ff4343"
          p={8}
          maxW="md"
          boxShadow="xl">
          <Alert.Indicator color="red.600" boxSize="3rem" mr={0} mb={4} />
          <Alert.Content>
            <Alert.Title fontSize="lg" fontWeight="semibold">
              Something Went Wrong!
            </Alert.Title>
            <Alert.Description opacity={0.8} fontSize="md" maxWidth="sm" mt={3}>
              Please refresh the browser and try again
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Center>
    );

  // loading....
  return (
    <Center flexDirection="column" h="100vh">
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
        color="white"
        className="animate-pulse">
        Loading Please Wait...
      </Text>
    </Center>
  );
}

export default StartScreen;
