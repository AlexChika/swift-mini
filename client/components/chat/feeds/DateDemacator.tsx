import { dateFormatter } from "@/lib";
import { Text } from "@chakra-ui/react";

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
      opacity="0.4"
      borderRadius={7}
      px={5}
      bg="otherUserTextBg"
      color="primaryText"
      my={5}
      textTransform="capitalize"
      fontSize={13}
    >
      {demacatorText}
    </Text>
  );
}

export default DateDemacator;
