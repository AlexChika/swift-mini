import { Box } from "@chakra-ui/react";

function SearchIcon({ className, style, color = "currentColor" }: IconProp) {
  return (
    <Box color={color}>
      <svg
        style={style}
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />

        <path d="M10.5 19.2a8.5 8.5 0 0 1 -3.1 -.7l-4.4 1l1.2 -3.5c-2.1 -3.1 -1.3 -7.1 1.9 -9.3c3.2 -2.3 7.8 -2.1 10.7 .4c1.5 1.3 2.3 3.0 2.4 4.7" />

        <circle cx="17.5" cy="17.5" r="4" />

        <path d="M20.5 20.5l2.5 2.5" />
      </svg>
    </Box>
  );
}

export default SearchIcon;
