import { Box } from "@chakra-ui/react";

function CallIcon({ className, style, color = "currentColor" }: IconProp) {
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
        {/* Back phone (smallest, rightmost) */}
        <g transform="translate(14, 4) scale(0.6)" opacity="0.4">
          <path
            d="M3.62 6.79C4.56 8.62 6.38 10.44 8.21 11.38L9.41 10.18C9.55 10.04 9.75 10 9.93 10.07C10.65 10.3 11.45 10.42 12.29 10.42C12.56 10.42 12.79 10.65 12.79 10.92V13C12.79 13.27 12.56 13.5 12.29 13.5C6.81 13.5 2.29 8.98 2.29 3.5C2.29 3.23 2.52 3 2.79 3H4.87C5.14 3 5.37 3.23 5.37 3.5C5.37 4.34 5.49 5.14 5.72 5.86C5.79 6.04 5.75 6.24 5.61 6.38L4.41 7.58C4.27 7.72 4.08 7.72 3.94 7.58L3.62 6.79Z"
            fill="currentColor"
          />
        </g>

        {/* Middle phone (medium size, middle) */}
        <g transform="translate(8, 6) scale(0.8)" opacity="0.6">
          <path
            d="M3.62 6.79C4.56 8.62 6.38 10.44 8.21 11.38L9.41 10.18C9.55 10.04 9.75 10 9.93 10.07C10.65 10.3 11.45 10.42 12.29 10.42C12.56 10.42 12.79 10.65 12.79 10.92V13C12.79 13.27 12.56 13.5 12.29 13.5C6.81 13.5 2.29 8.98 2.29 3.5C2.29 3.23 2.52 3 2.79 3H4.87C5.14 3 5.37 3.23 5.37 3.5C5.37 4.34 5.49 5.14 5.72 5.86C5.79 6.04 5.75 6.24 5.61 6.38L4.41 7.58C4.27 7.72 4.08 7.72 3.94 7.58L3.62 6.79Z"
            fill="currentColor"
          />
        </g>

        {/* Front phone (largest, leftmost) */}
        <g transform="translate(2, 8) scale(1.0)">
          <path
            d="M3.62 6.79C4.56 8.62 6.38 10.44 8.21 11.38L9.41 10.18C9.55 10.04 9.75 10 9.93 10.07C10.65 10.3 11.45 10.42 12.29 10.42C12.56 10.42 12.79 10.65 12.79 10.92V13C12.79 13.27 12.56 13.5 12.29 13.5C6.81 13.5 2.29 8.98 2.29 3.5C2.29 3.23 2.52 3 2.79 3H4.87C5.14 3 5.37 3.23 5.37 3.5C5.37 4.34 5.49 5.14 5.72 5.86C5.79 6.04 5.75 6.24 5.61 6.38L4.41 7.58C4.27 7.72 4.08 7.72 3.94 7.58L3.62 6.79Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Box>
  );
}

export default CallIcon;
