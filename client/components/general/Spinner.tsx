import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

type Props = SpinnerProps & {
  trackColor?: SpinnerProps["borderBottomColor"];
};

function Spinner(props: Props) {
  const {
    size = "md",
    borderWidth = 3,
    trackColor = "red.600",
    color = "var(--swiftReverseLight)",
    ...rest
  } = props;
  return (
    <ChakraSpinner
      {...rest}
      size={size}
      color={"transparent"}
      borderTopColor={color}
      borderBottomColor={color}
      borderWidth={borderWidth}
      borderLeftColor={trackColor}
      borderRightColor={trackColor}
    />
  );
}

export default Spinner;
