import { dateFormatter } from "@/lib";
import { Box, Flex, Text } from "@chakra-ui/react";

export function renderObjectForDateDemacator(msgs: Message[]) {
  const control: Record<string, boolean> = {};
  const render: Record<string, string> = {};

  msgs.forEach((m) => {
    const time = m.createdAt;
    const timeOfWeek = dateFormatter(time).getTimeOfWeek();

    if (control[timeOfWeek]) return;
    control[timeOfWeek] = true;
    render[m.id] = timeOfWeek;
  });

  return render;
}

type Props = {
  demacatorText: string | undefined;
};

function DateDemacator({ demacatorText }: Props) {
  if (!demacatorText) return "";

  return (
    <Text
      w="max-content"
      mx="auto"
      opacity="0.5"
      borderRadius={10}
      px={5}
      bg="whiteAlpha.300"
      my={5}
      textTransform="capitalize"
      fontSize={13}
    >
      {demacatorText}
    </Text>
  );

  return (
    <Flex
      opacity="0.5"
      mx={{ base: 3, xmd: 12 }}
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
      <Box
        borderColor="whiteAlpha.50"
        h="0"
        borderWidth={1}
        // maxW="100px"
        flex="1"
      />

      <Text
        opacity="0.5"
        borderRadius={10}
        px={5}
        bg="whiteAlpha.300"
        my={5}
        textTransform="capitalize"
        fontSize={13}
      >
        {demacatorText}
      </Text>
      <Box
        h="0"
        borderColor="whiteAlpha.50"
        borderWidth={1}
        flex="1"
        // maxW="100px"
      />
    </Flex>
  );
}

export default DateDemacator;
