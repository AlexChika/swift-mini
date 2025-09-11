import {
  SystemStyleObject,
  createSystem,
  defaultConfig,
  defineConfig
} from "@chakra-ui/react";

const space = {
  px: { value: "0.0625rem" },
  0.5: { value: "0.125rem" },
  1: { value: "0.25rem" },
  1.5: { value: "0.375rem" },
  2: { value: "0.5rem" },
  2.5: { value: "0.625rem" },
  3: { value: "0.75rem" },
  3.5: { value: "0.875rem" },
  4: { value: "1rem" },
  5: { value: "1.25rem" },
  6: { value: "1.5rem" },
  7: { value: "1.75rem" },
  8: { value: "2rem" },
  9: { value: "2.25rem" },
  10: { value: "2.5rem" },
  12: { value: "3rem" },
  14: { value: "3.5rem" },
  16: { value: "4rem" },
  20: { value: "5rem" },
  24: { value: "6rem" },
  28: { value: "7rem" },
  32: { value: "8rem" },
  36: { value: "9rem" },
  40: { value: "10rem" },
  44: { value: "11rem" },
  48: { value: "12rem" },
  52: { value: "13rem" },
  56: { value: "14rem" },
  60: { value: "15rem" },
  64: { value: "16rem" },
  72: { value: "18rem" },
  80: { value: "20rem" },
  96: { value: "24rem" }
};

const config = defineConfig({
  cssVarsPrefix: "swft",
  globalCss: {
    html: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box"
    },
    body: {
      maxWidth: "63.75rem",
      // maxWidth: "93.75rem",
      margin: "0 auto !important"
    },
    "[contenteditable]": {
      outline: "0px solid transparent"
    },
    "[contenteditable] *": {
      textWrap: "wrap !important"
    },
    ".animate-spin": {
      animation: "spin 0.6s linear infinite"
    },
    ".animate-pulse": {
      animation: "pulse 2s ease-in-out infinite"
    }
  },

  theme: {
    breakpoints: {
      base: "0rem",
      xs: "20rem",
      sm: "25rem",
      md: "35rem",
      xmd: "48rem",
      "2xmd": "55rem",
      lg: "60rem",
      xl: "75rem",
      "2xl": "96rem"
    },
    tokens: {
      colors: {
        red: {
          DEFAULT: { value: "#EE0F0F" }
        }
      },

      spacing: { ...space },

      sizes: { ...space }
    },

    semanticTokens: {
      colors: {
        appBorder: {
          value: {
            base: "#dbdbdb",
            _dark: "black"
          }
        }, // borders

        messageBorder: {
          value: {
            base: "#dbdbdb",
            _dark: "#3a3a3a"
          }
        }, // message border

        emptyChatScreen: {
          value: {
            base: "#f0f0f0",
            _dark: "#151515"
          }
        },

        primaryBg: {
          value: {
            base: "#bcbcbc",
            _dark: "#474747"
            // _dark: "#0d0d0d",
          }
        }, // lighter version of secondaryBg for message input, create conversation btn

        // add skeleton mode
        // use transparent bgs

        secondaryBg: {
          value: {
            base: "#ffffff",
            _dark: "#191919"
          }
        }, // bg for feeds & conversation panel

        primaryText: {
          value: {
            base: "#000000",
            _dark: "#ffffff"
          }
        }, // default text color

        usernameColor: {
          value: {
            base: "#507c7c",
            _dark: "#9e9e9e"
          }
        }, // colors for usermessage usernames and time

        userTextBg: {
          value: {
            base: "#f1f1f1",
            _dark: "#21212b"
          }
        }, // colors for usermessage background

        otherUserTextBg: {
          value: {
            base: "#ffffff",
            _dark: "#2a2a31"
          }
        } // colors for other usermessage background
      }
    },

    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" }
      },

      pulse: {
        "0%": {
          opacity: 0.4,
          transform: "scale(1)"
        },
        "50%": {
          opacity: 1,
          transform: "scale(1.05)"
        },
        "100%": {
          opacity: 0.4,
          transform: "scale(1)"
        }
      }
    }
  }
});

const system = createSystem(defaultConfig, config);

export default system;

const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: "none"
};

export { hideScrollbar };
