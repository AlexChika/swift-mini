import { Box } from "@chakra-ui/react";

function AIChatIcon({ className, style, color = "currentColor" }: IconProp) {
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
        {/* <!-- Main chat bubble with futuristic design --> */}
        <path
          d="M18 4H6C3.79086 4 2 5.79086 2 8V14C2 16.2091 3.79086 18 6 18H7.5L10.8 21.3C11.0687 21.5687 11.4313 21.5687 11.7 21.3C11.8876 21.1124 12 20.8487 12 20.5687V18H18C20.2091 18 22 16.2091 22 14V8C22 5.79086 20.2091 4 18 4Z"
          fill="currentColor"
        />

        {/* <!-- AI Brain/Neural network pattern --> */}
        <g opacity="0.9">
          {/* <!-- Central AI node --> */}
          <circle cx="12" cy="11" r="2" fill="red" />

          {/* <!-- Neural connections --> */}
          <g stroke="white" strokeWidth="0.8" opacity="0.7">
            {/* <!-- Top connections --> */}
            <line x1="10.5" y1="9.5" x2="8" y2="7.5" />
            <line x1="13.5" y1="9.5" x2="16" y2="7.5" />

            {/* <!-- Side connections --> */}
            <line x1="10" y1="11" x2="6.5" y2="11" />
            <line x1="14" y1="11" x2="17.5" y2="11" />

            {/* <!-- Bottom connections --> */}
            <line x1="10.5" y1="12.5" x2="8" y2="14.5" />
            <line x1="13.5" y1="12.5" x2="16" y2="14.5" />
          </g>

          {/* <!-- Outer nodes --> */}
          <circle cx="8" cy="7.5" r="1" fill="red" opacity="0.8" />
          <circle cx="16" cy="7.5" r="1" fill="red" opacity="0.8" />
          <circle cx="6.5" cy="11" r="1" fill="red" opacity="0.8" />
          <circle cx="17.5" cy="11" r="1" fill="red" opacity="0.8" />
          <circle cx="8" cy="14.5" r="1" fill="red" opacity="0.8" />
          <circle cx="16" cy="14.5" r="1" fill="red" opacity="0.8" />
        </g>

        {/* <!-- AI accent - glowing effect --> */}
        <circle
          cx="12"
          cy="11"
          r="2.5"
          fill="none"
          stroke="red"
          strokeWidth="0.3"
          opacity="0.3"
        />

        {/* <!-- Modern tech accent --> */}
        <rect
          x="19"
          y="5"
          width="1"
          height="12"
          rx="0.5"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    </Box>
  );
}

export default AIChatIcon;
