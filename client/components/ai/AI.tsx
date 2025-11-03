import { useRef } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import StepCarousel, { useNextCarousel } from "../general/StepCarousel";
import AllChats from "../allChats/AllChats";

function AI() {
  const ContainerRef = useRef<HTMLDivElement>(null);

  const { currIdx, nextStep } = useNextCarousel({
    noOfSteps: 5,
    ref: ContainerRef,
    startStep: 4,
    carouselId: "AiChat"
  });

  return (
    <StepCarousel
      h="600px"
      carouselId="AiChat"
      carouselCurrIdx={currIdx}
      carouselRef={ContainerRef}
      carouselSteps={[
        <Box h="150px" bg="red" key="step1">
          <Text>Step One 1</Text>
          <Button onClick={() => nextStep(true)}>Goto page two</Button>
        </Box>,

        <Box bg="teal" h="300px" key="step2">
          <Text>Step Two</Text>
          <Button onClick={() => nextStep(3)}>Goto page Three</Button>
        </Box>,

        <Box bg="blue" h="500px" key="step3">
          <Text>Step Three</Text>
          <Button onClick={() => nextStep(true)}>Goto page Four</Button>
        </Box>,

        <Box bg="green" key="step4">
          <Text>Step Four</Text>
          <Button onClick={() => nextStep(5)}>Goto page Five</Button>
        </Box>,

        <Box key="tree">
          <Text>Step Five</Text>
          <Button onClick={() => nextStep(1)}>Goto page One</Button>
          <AllChats
            session={{
              expires: "5667890",
              user: { id: "66", username: "hahhahha" }
            }}
          />
        </Box>
      ]}
    />
  );
}

export default AI;
