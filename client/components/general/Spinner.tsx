import { Box, ResponsiveValue } from "@chakra-ui/react";
import { Property } from "csstype";

type Position =
  | ResponsiveValue<
      | number
      | (string & {})
      | "-moz-initial"
      | "inherit"
      | "initial"
      | "revert"
      | "revert-layer"
      | "unset"
      | "auto"
    >
  | undefined;

type Props = {
  primaryColor?: ResponsiveValue<Property.BorderLeftColor>;
  secondaryColor?: ResponsiveValue<Property.BorderBottomColor>;
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
      borderX="4px"
      borderY="4px"
      borderLeftColor={primaryColor}
      borderRightColor={primaryColor}
      borderTopColor={secondaryColor}
      borderBottomColor={secondaryColor}
      borderRadius="full"
    />
  );
}

export default Spinner;
