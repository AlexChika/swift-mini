import useFetchConversation, {
  useFetchChat,
  useFetchChats
} from "@/lib/hooks/useFetchConversation";
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
  // const { data, error } = useFetchChats();
  const { data, error } = useFetchConversation();
  // useFetchChats();
  // useFetchChat();

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
