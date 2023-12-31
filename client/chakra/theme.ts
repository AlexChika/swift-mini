import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  { config },

  {
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
