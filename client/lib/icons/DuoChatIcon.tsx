import { Box } from "@chakra-ui/react";

function DuoChatIcon({ className, style, color = "currentColor" }: IconProp) {
  const fill = "var(--swiftLight)";
  return (
    <Box color={color}>
      <svg
        style={style}
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 4H6C3.79086 4 2 5.79086 2 8V14C2 16.2091 3.79086 18 6 18H7.5L10.8 21.3C11.0687 21.5687 11.4313 21.5687 11.7 21.3C11.8876 21.1124 12 20.8487 12 20.5687V18H18C20.2091 18 22 16.2091 22 14V8C22 5.79086 20.2091 4 18 4Z"
          fill="currentColor"
        />

        <g opacity="0.9">
          <rect x="5" y="8.5" width="8" height="1.5" rx="0.75" fill={fill} />
          <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill={fill} />
          <rect x="5" y="13.5" width="6" height="1.5" rx="0.75" fill={fill} />
        </g>

        <g opacity="0.8">
          <circle cx="15.5" cy="9.25" r="0.6" fill={fill} />
          <circle cx="16.8" cy="9.25" r="0.5" fill={fill} />
          <circle cx="17.9" cy="9.25" r="0.4" fill={fill} />
        </g>

        <rect
          x="2"
          y="7"
          width="20"
          height="0.5"
          rx="0.25"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    </Box>
  );
}

export default DuoChatIcon;
