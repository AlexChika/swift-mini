import { Skeleton } from "@chakra-ui/react";
type Props = { no: number; height: string; duration: number };

function SkeletonLoader({ no, height }: Props) {
  return Array.from({ length: no }).map((_, i) => {
    return (
      <Skeleton
        css={{
          "--start-color": "whiteAlpha.50",
          "--end-color": "whiteAlpha.200"
        }}
        height={height}
        width={{ base: "100%" }}
        key={i}
      />
    );
  });
}

export default SkeletonLoader;
//   bg = "";
