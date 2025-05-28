import useFetchConversation from "@/lib/hooks/useFetchConversation";
import { Image } from "@chakra-ui/react";
import { Center, Alert, Text } from "@chakra-ui/react";
import Spinner from "../general/Spinner";

type Props = {
  Child: React.ReactNode;
};

// start screen features to be added
// 1. implment storing chats in cache.... use indexedDB... then revalidate when connected.

// 2. get all conversations from DB and reconcile with chats in cache. meaning: delete chats belonging to deleted conversations

// 3. implement batch fetching of chats. when the user scrolls up, then fetch more chats.

//  HOW TO IMPLEMENT No 3 and sync with cache (IndexedDB)
// 1. when no chats in cache... db fetches 500 chats.
// 2. when cache, show chats from catch then revalidate from db. cache stores only 500 chats too
// 3. when user scrolls up, then fetch more chats from db.
// 4.more chats from db should be stored temporarily in cache
// 5. delete more chats in cache after 24 hours.
// 6

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
