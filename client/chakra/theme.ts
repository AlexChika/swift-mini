import {
  SystemStyleObject,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const space = {
  px: { value: "1px" },
  0.5: { value: "2px" },
  1: { value: "4px" },
  1.5: { value: "6px" },
  2: { value: "8px" },
  2.5: { value: "10px" },
  3: { value: "12px" },
  3.5: { value: "14px" },
  4: { value: "16px" },
  5: { value: "20px" },
  6: { value: "24px" },
  7: { value: "28px" },
  8: { value: "32px" },
  9: { value: "36px" },
  10: { value: "40px" },
  12: { value: "48px" },
  14: { value: "56px" },
  16: { value: "64px" },
  20: { value: "80px" },
  24: { value: "96px" },
  28: { value: "112px" },
  32: { value: "128px" },
  36: { value: "144px" },
  40: { value: "160px" },
  44: { value: "176px" },
  48: { value: "192px" },
  52: { value: "208px" },
  56: { value: "224px" },
  60: { value: "240px" },
  64: { value: "256px" },
  72: { value: "288px" },
  80: { value: "320px" },
  96: { value: "384px" },
};

const config = defineConfig({
  cssVarsPrefix: "swft",
  globalCss: {
    html: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    body: {
      maxWidth: "1250px",
      margin: "0 auto",
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

      spacing: {
        ...space,
      },

      sizes: { ...space },
    },
    semanticTokens: {
      colors: {
        appBorder: {
          value: {
            base: "#dbdbdb",
            _dark: "#60606047",
          },
        }, // borders

        appBorderDivider: {
          value: {
            base: "#dbdbdb83",
            _dark: "#60606047",
          },
        }, // border dividing conversations and chat feeds

        bg: {
          value: {
            base: "rgb(117, 117, 117)",
            _dark: "rgb(0, 0, 0)",
          },
        }, // not used

        primaryBg: {
          value: {
            base: "#e5e5e5",
            _dark: "#4f4f5e",
          },
        }, // lighter version of secondaryBg for message input, create conversation btn

        // add skeleton mode
        // use transparent bgs

        secondaryBg: {
          value: {
            base: "#ffffff",
            _dark: "#0d0d0d",
            // _dark: "#252525",
            // _dark: "#2f2f3a", // default
          },
        }, // bg for feeds & conversation panel

        primaryText: {
          value: {
            base: "#000000",
            _dark: "#ffffff",
          },
        }, // default text color

        usernameColor: {
          value: {
            base: "#507c7c",
            _dark: "#9e9e9e",
          },
        }, // colors for usermessage usernames and time

        userTextBg: {
          value: {
            base: "#ffffff",
            _dark: "#43434e8e",
          },
        }, // colors for usermessage background

        otherUserTextBg: {
          value: {
            base: "#ededed",
            _dark: "#4e4e6459",
          },
        }, // colors for other usermessage background
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

const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: "none",
};

export { hideScrollbar };
