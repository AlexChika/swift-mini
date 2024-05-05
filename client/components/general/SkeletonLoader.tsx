import { Skeleton } from "@chakra-ui/react";
type Props = { no: number; height: string; duration: number };

function SkeletonLoader({ no, height, duration }: Props) {
  return Array.from({ length: no }).map((_, i) => {
    return (
      <Skeleton
        fadeDuration={duration}
        startColor="whiteAlpha.50"
        endColor="whiteAlpha.200"
        height={height}
        width={{ base: "100%" }}
        key={i}
      />
    );
  });
}

export default SkeletonLoader;
//   bg = "";
