import SwiftStore from "@/store/Store";
import { Center, Text } from "@chakra-ui/react";
import ErrorUI from "@/components/general/Error";
import SwiftLoading from "@/components/general/SwiftLoading";

type Props = {
  Child: React.ReactNode;
};

function StartScreen({ Child }: Props) {
  const { initSwiftMini } = SwiftStore();

  const { data, status, msg } = initSwiftMini;

  if (data) return Child;

  if (status === "failed") return <ErrorUI error={msg} />;

  if (status === "error")
    return <ErrorUI error="Please refresh the browser and try again." />;

  // loading....
  return (
    <Center flexDirection="column" h="100vh">
      <SwiftLoading />

      <Text
        color="white"
        fontSize="14px"
        fontWeight={500}
        textAlign="center"
        fontStyle="italic"
        className="animate-pulse">
        Loading Please Wait...
      </Text>
    </Center>
  );
}

export default StartScreen;
