import { SystemStyleObject, ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: () => ({
    "[contenteditable]": {
      outline: "0px solid transparent",
    },
    "[contenteditable] *": {
      textWrap: "wrap !important",
    },
  }),
};

const theme = extendTheme(
  { config },

  {
    styles,

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

    colors: {
      brand: {
        100: "#3d84f7",
        // ...
        900: "#1a202c",
      },
    },
  }
);

export default theme;

// .hide_scroll_bar::-webkit-scrollbar {
//   -webkit-appearance: none;
//   appearance: none;
//   display: none;
// }

const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: "none",
};

export { hideScrollbar };
