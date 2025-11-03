import { Box } from "@chakra-ui/react";

function GroupChatIcon({ className, style, color = "currentColor" }: IconProp) {
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
          d="M18 6C18 3.79086 16.2091 2 14 2H6C3.79086 2 2 3.79086 2 6V12C2 14.2091 3.79086 16 6 16H7V18.5C7 18.7761 7.22386 19 7.5 19C7.61374 19 7.71976 18.9473 7.78944 18.8561L10.3447 15.5553C10.5386 15.3047 10.8324 15.1667 11.1447 15.1667H14C16.2091 15.1667 18 13.3758 18 11.1667V6Z"
          fill="currentColor"
        />

        <g transform="translate(5, 7)">
          <circle cx="1.5" cy="1.5" r="1.2" fill={fill} />
          <path
            d="M0 4.5C0 3.67157 0.67157 3 1.5 3S3 3.67157 3 4.5V5H0V4.5Z"
            fill={fill}
          />
        </g>

        <g transform="translate(8.5, 6.5)">
          <circle cx="1.5" cy="1.5" r="1.3" fill={fill} />
          <path
            d="M0 4.8C0 3.97157 0.67157 3.3 1.5 3.3S3 3.97157 3 4.8V5.3H0V4.8Z"
            fill={fill}
          />
        </g>

        <g transform="translate(12, 7)">
          <circle cx="1.5" cy="1.5" r="1.2" fill={fill} />
          <path
            d="M0 4.5C0 3.67157 0.67157 3 1.5 3S3 3.67157 3 4.5V5H0V4.5Z"
            fill={fill}
          />
        </g>
      </svg>
    </Box>
  );
}

export default GroupChatIcon;
