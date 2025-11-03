import { memo, useMemo, useRef } from "react";
import SelectUsersStep from "./SelectUsersStep";
import GroupDetailsStep from "./GroupDetailsStep";
import StepCarousel, {
  useNextCarousel
} from "@/components/general/StepCarousel";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUIState: React.Dispatch<React.SetStateAction<Swift.Create_Chats_UI_State>>;
};

function CreateGroupPane(props: Props) {
  const { setIsOpen, setUIState } = props;
  const containerRef = useRef(null);

  const { currIdx, nextStep } = useNextCarousel({
    noOfSteps: 2,
    ref: containerRef,
    carouselId: "createGroup"
  });

  const carouselSteps = useMemo(() => {
    return [
      <SelectUsersStep
        key="step1"
        nextStep={nextStep}
        setUIState={setUIState}
      />,

      <GroupDetailsStep nextStep={nextStep} setIsOpen={setIsOpen} key="step2" />
    ];
  }, [setIsOpen, nextStep, setUIState]);

  return (
    <StepCarousel
      h="calc(100% - 3.5rem)"
      carouselId="createGroup"
      carouselRef={containerRef}
      carouselCurrIdx={currIdx}
      carouselSteps={carouselSteps}
    />
  );
}

export default memo(CreateGroupPane);
