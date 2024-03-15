import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  { config },

  {
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
      styles: {
        global: () => ({
          body: {
            bg: "whiteAlpha.200",
          },
        }),
      },
    },
  }
);

export default theme;
