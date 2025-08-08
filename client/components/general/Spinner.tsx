import { Box, ConditionalValue } from "@chakra-ui/react";
import { Property } from "csstype";

type Position = ConditionalValue<Property.Top<string | number>>;

type Props = {
  primaryColor?: ConditionalValue<Property.BorderLeftColor>;
  secondaryColor?: ConditionalValue<Property.BorderBottomColor>;
} & {
  absolute: boolean;
  top?: Position;
  right?: Position;
};

function Spinner({
  primaryColor = "red",
  secondaryColor = "#404040",
  top = "calc(50% + 18px)",
  right = "calc(50% + 5px)",
  absolute,
}: Props) {
  return (
    <Box
      top={top}
      right={right}
      pos={absolute ? "absolute" : undefined}
      className="animate-spin"
      boxSize="32px"
      borderWidth="5px"
      borderLeftColor={primaryColor}
      borderRightColor={primaryColor}
      borderTopColor={secondaryColor}
      borderBottomColor={secondaryColor}
      borderRadius="full"
    />
  );
}

export default Spinner;
