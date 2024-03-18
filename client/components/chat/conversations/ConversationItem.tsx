import { StackItem } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

type Props = {
  conversation: Conversation;
  conversationOnClick: (conversationId: string) => Promise<void>;
};

function Conversation(props: Props) {
  const { conversation, conversationOnClick } = props;
  const { id, latestMessage, participants, latestMessageId } = conversation;

  const search = useSearchParams();
  const conversationId = search.get("conversationId");

  // variable depends on stateful values,
  const isSelected = id === conversationId;

  return (
    <StackItem
      cursor="pointer"
      onClick={() => conversationOnClick(id)}
      p={3}
      bg={isSelected ? "whiteAlpha.200" : ""}
      _hover={{ bg: "whiteAlpha.200" }}
    >
      {id}
    </StackItem>
  );
}

export default Conversation;
