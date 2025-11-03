import { Box } from "@chakra-ui/react";

function ProfileIcon({ className, style, color = "currentColor" }: IconProp) {
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
        {/* Outer profile circle background */}
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9" />

        {/* User head */}
        <circle cx="12" cy="9" r="3.5" fill={fill} opacity="0.9" />

        {/* User body/shoulders */}
        <path
          d="M5 19C5 15.134 8.134 12 12 12C15.866 12 19 15.134 19 19V21C19 21.552 18.552 22 18 22H6C5.448 22 5 21.552 5 21V19Z"
          fill={fill}
          opacity="0.9"
        />

        {/* Modern accent ring */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Inner tech accent */}
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke={fill}
          strokeWidth="0.3"
          opacity="0.6"
        />

        {/* Status indicator (optional) */}
        <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.8" />
        <circle cx="18" cy="6" r="1.2" fill={fill} opacity="0.9" />
      </svg>
    </Box>
  );
}

export default ProfileIcon;
