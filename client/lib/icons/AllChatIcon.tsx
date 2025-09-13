import { Box } from "@chakra-ui/react";
import { useThemeValue } from "../helpers/color-mode";

function AllChatIcon({ className, style, color = "currentColor" }: IconProp) {
  const fill = useThemeValue("white", "black");

  return (
    <Box color={color}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M20 4C20 2.89543 19.1046 2 18 2H14C12.8954 2 12 2.89543 12 4V7C12 8.10457 12.8954 9 14 9H15.5858L17.2929 10.7071C17.4804 10.8946 17.7348 11 18 11C18.5523 11 19 10.5523 19 10V9H18C19.1046 9 20 8.10457 20 7V4Z"
          fill="currentColor"
          opacity="0.4"
        />

        <path
          d="M17 7C17 5.89543 16.1046 5 15 5H9C7.89543 5 7 5.89543 7 7V11C7 12.1046 7.89543 13 9 13H10.5858L12.2929 14.7071C12.4804 14.8946 12.7348 15 13 15C13.5523 15 14 14.5523 14 14V13H15C16.1046 13 17 12.1046 17 11V7Z"
          fill="currentColor"
          opacity="0.6"
        />

        <path
          d="M14 10C14 8.89543 13.1046 8 12 8H4C2.89543 8 2 8.89543 2 10V15C2 16.1046 2.89543 17 4 17H5V20C5 20.5523 5.44772 21 6 21C6.26522 21 6.51957 20.8946 6.70711 20.7071L9.41421 18H12C13.1046 18 14 17.1046 14 16V10Z"
          fill="currentColor"
        />

        <rect
          x="4.5"
          y="11.5"
          width="2"
          height="1"
          rx="0.5"
          fill={fill}
          opacity="0.8"
        />
        <rect
          x="7.5"
          y="11.5"
          width="3"
          height="1"
          rx="0.5"
          fill={fill}
          opacity="0.8"
        />
        <rect
          x="4.5"
          y="14"
          width="1.5"
          height="1"
          rx="0.5"
          fill={fill}
          opacity="0.8"
        />
        <rect
          x="7"
          y="14"
          width="2.5"
          height="1"
          rx="0.5"
          fill={fill}
          opacity="0.8"
        />
      </svg>
    </Box>
  );
}

export default AllChatIcon;
