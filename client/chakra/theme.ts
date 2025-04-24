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
            base: "white",
            _dark: "#909090",
          },
        }, // borders

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
        }, // bg for conversations panel

        primaryBg2: {
          value: {
            base: "#ffffff",
            _dark: "#3f3f4b",
          },
        }, // bg for createconversatio btn in conversation panel

        secondaryBg: {
          value: {
            base: "#ffffff",
            _dark: "#33333d",
          },
        }, // bg for feeds panel

        secondaryBg2: {
          // lighter version of secondaryBg for messageHeader
          value: {
            base: "#efefef",
            _dark: "#3c3c47",
          },
        },

        primaryText: {
          value: {
            base: "#000000",
            _dark: "#ffffff",
          },
        }, // default text color

        userText: {
          value: {
            base: "#000000",
            _dark: "#ffffff",
          },
        }, // colors for user message body

        userText2: {
          value: {
            base: "#5949b9",
            _dark: "#9e9e9e",
          },
        }, // colors for usermessage usernames and time

        userTextBg: {
          value: {
            base: "#00076516",
            _dark: "#40404f",
          },
        }, // colors for usermessage background

        otherUserText: {
          value: {
            base: "#000000",
            _dark: "#ffffff",
          },
        }, // colors for other user message body

        otherUserText2: {
          value: {
            base: "teal",
            _dark: "#9e9e9e",
          },
        }, // colors for other usermessage usernames and time

        otherUserTextBg: {
          value: {
            base: "#00000013",
            _dark: "#212128",
          },
        }, // colors for other usermessage background

        conversationTextHover: {
          value: {
            base: "{colors.blue.400}",
            _dark: "{colors.blue.900}",
          },
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

const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: "none",
};

export { hideScrollbar };
