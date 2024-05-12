import { dateFormatter } from "@/lib";
import { Text } from "@chakra-ui/react";

export function renderObjectForDateDemacator(msgs: Message[]) {
  const control: Record<string, boolean> = {};
  const render: Record<string, string | number> = {};

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
  shouldRender: string | number | undefined;
};

function DateDemacator({ shouldRender }: Props) {
  if (!shouldRender) return "";

  return (
    <Text
      mx="auto"
      opacity="0.5"
      borderRadius={10}
      px={5}
      w="max-content"
      bg="whiteAlpha.300"
      my={5}
      textAlign="center"
      textTransform="uppercase"
      fontSize={13}
    >
      {shouldRender}
    </Text>
  );
}

export default DateDemacator;
