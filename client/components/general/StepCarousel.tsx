import React, { useRef, useCallback, memo } from "react";
import { Box, Flex, FlexProps } from "@chakra-ui/react";

type Props = {
  carouselCurrIdx: number;
  carouselId: string;
  carouselSteps: React.ReactNode[];
  carouselRef: React.RefObject<HTMLDivElement | null>;
} & FlexProps;

function StepCarousel(props: Props) {
  const {
    carouselRef,
    carouselSteps,
    carouselCurrIdx,
    carouselId,
    ...flexProps
  } = props;

  return (
    <Flex
      ref={carouselRef}
      mt={flexProps.mt || 2}
      h={flexProps.h || "100%"}
      background={flexProps.bg || "{colors.secondaryBg}"}
      {...flexProps}
      w="100%"
      align="center"
      pos="relative"
      overflow="hidden"
      justifyContent="center">
      {carouselSteps.map((STEP, i) => (
        <Box
          key={i}
          left="0"
          h="100%"
          w="100%"
          bg="inherit"
          pos="absolute"
          overflowY="auto"
          zIndex={i + 1 === carouselCurrIdx ? 10 : ""}
          data-swift-carousel={carouselId}>
          {STEP}
        </Box>
      ))}
    </Flex>
  );
}

type UseNextProps = {
  noOfSteps: number;
  carouselId: string;
  startStep?: number;
  ref: React.RefObject<HTMLDivElement | null>;
};

export function useNextCarousel(opts: UseNextProps) {
  const { ref, noOfSteps, carouselId, startStep = 1 } = opts;
  const index = useRef(startStep > noOfSteps || startStep < 1 ? 1 : startStep);
  const carouselIdRef = useRef(carouselId);

  const nextIndex = useCallback(
    (index: number, goto: boolean | number = true) => {
      let idx = index;

      if (typeof goto === "boolean") {
        if (goto) {
          idx = index + 1 <= noOfSteps ? index + 1 : noOfSteps;
        } else {
          idx = index - 1 >= 1 ? index - 1 : 1;
        }
      } else if (typeof goto === "number") {
        idx = goto > noOfSteps || goto < 1 ? idx : goto;
      }

      return idx;
    },
    [noOfSteps]
  );

  const getElements = useCallback(
    (carouselId = "") => {
      if (!ref.current) return [];
      carouselId = carouselId || carouselIdRef.current;

      const el: HTMLDivElement[] = Array.from(
        ref.current.querySelectorAll(`[data-swift-carousel="${carouselId}"]`)
      );

      return el;
    },
    [ref]
  );

  const stack = useCallback(
    function (idx: number, goto: boolean | number) {
      const nextIdx = nextIndex(idx, goto);
      if (nextIdx === idx) return;

      const stepArr = getElements();
      const stepInView = stepArr[idx - 1];
      const nextStep = stepArr[nextIdx - 1];

      function getDirection() {
        return nextIdx > idx ? "right" : "left";
      }

      // reset stack
      stepInView.style.zIndex = "20";
      stepArr.forEach((el, i) => {
        if (i + 1 !== nextIdx && i + 1 !== idx) {
          el.style.zIndex = "1";
        }

        el.style.left = "0";
        el.style.transition = "none";
        el.style.transform = "translateX(0)";
      });

      // re-arrange stack
      if (getDirection() === "right") nextStep.style.left = "100%";
      else nextStep.style.left = "-100%";
      nextStep.style.zIndex = "10";

      // slide all elements
      function slide() {
        stepArr.forEach((el) => {
          el.style.transition = "transform 350ms linear";

          if (getDirection() === "right")
            el.style.transform = "translateX(-100%)";
          else el.style.transform = "translateX(100%)";
        });
      }

      requestIdleCallback(slide);
    },
    [getElements, nextIndex]
  );

  const nextStep = useCallback(
    function (goto: boolean | number) {
      const currIdx = index.current;
      if (currIdx === undefined) return index.current;

      const nextindex = nextIndex(currIdx, goto);

      stack(currIdx, goto);

      index.current = nextindex;
      return index.current;
    },
    [nextIndex, stack]
  );

  return {
    nextStep,
    currIdx: index.current
  };
}

export default memo(StepCarousel);
