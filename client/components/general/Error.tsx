import { Alert, Center } from "@chakra-ui/react";

function ErrorUI({
  error,
  title = " Something Went Wrong!"
}: {
  error: string;
  title?: string;
}) {
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
            {title}
          </Alert.Title>
          <Alert.Description opacity={0.8} fontSize="md" maxWidth="sm" mt={3}>
            {error}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Center>
  );
}

export default ErrorUI;
