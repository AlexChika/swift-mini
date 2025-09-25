import { Box } from "@chakra-ui/react";

function AIIcon({ className, style, color = "currentColor" }: IconProp) {
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
        {/* AI Brain/Neural network pattern */}
        <g opacity="0.9">
          {/* Central AI node (larger) */}
          <circle cx="12" cy="12" r="3" fill="currentColor" />

          {/* Neural connections */}
          <g stroke="transparent" strokeWidth="1.5" opacity="0.7">
            {/* Top connections */}
            <line x1="10" y1="9.5" x2="6" y2="6" />
            <line x1="14" y1="9.5" x2="18" y2="6" />

            {/* Side connections */}
            <line x1="9" y1="12" x2="4" y2="12" />
            <line x1="15" y1="12" x2="20" y2="12" />

            {/* Bottom connections */}
            <line x1="10" y1="14.5" x2="6" y2="18" />
            <line x1="14" y1="14.5" x2="18" y2="18" />
          </g>

          {/* Outer nodes (larger) */}
          <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="6" cy="18" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="18" cy="18" r="1.5" fill="currentColor" opacity="0.8" />
        </g>

        {/* AI accent - glowing effect */}
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>
    </Box>
  );
}

export default AIIcon;
