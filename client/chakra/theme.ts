import {
  SystemStyleObject,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const config = defineConfig({
  cssVarsPrefix: "swft",
  globalCss: {
    html: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    "[contenteditable]": {
      outline: "0px solid transparent",
    },
    "[contenteditable] *": {
      textWrap: "wrap !important",
    },
    ".animate-spin": {
      animation: "spin 0.6s linear infinite",
    },
  },
  theme: {
    breakpoints: {
      base: "0px",
      xs: "320px",
      sm: "400px",
      md: "560",
      xmd: "768px",
      lg: "960px",
      xl: "1200px",
      "2xl": "1536px",
    },

    tokens: {
      colors: {
        red: {
          DEFAULT: { value: "#EE0F0F" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: {
            base: "{colors.blue.400}",
            _dark: "{colors.blue.900}",
          },
        },

        color: {
          DEFAULT: {
            value: { base: "{colors.red}", _dark: "{colors.darkred}" },
          },
        },

        brand: {
          100: { value: "3d84f7" },
          900: { value: "1a202c" },
        },
      },
    },

    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;

// .hide_scroll_bar::-webkit-scrollbar {
//   -webkit-appearance: none;
//   appearance: none;
//   display: none;
// }

const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: "none",
};

export { hideScrollbar };
