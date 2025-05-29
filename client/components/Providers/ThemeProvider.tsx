"use client";

import { Cookies } from "@/lib/helpers";
import React from "react";

type Theme = "light" | "dark";
type DefaultTheme = "light" | "dark" | "system";
type ServerTheme = "light" | "dark" | undefined;

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme,
  serverTheme,
}: {
  children: React.ReactNode;
  serverTheme: ServerTheme;
  defaultTheme: DefaultTheme;
}) {
  const isValidTheme = defaultTheme === "dark" || defaultTheme === "light";
  const tempTheme = serverTheme || (isValidTheme ? defaultTheme : "light");

  const [theme, setTheme] = React.useState<Theme>(tempTheme);
  const [__theme, __setTheme] = React.useState<ServerTheme>(serverTheme);

  React.useEffect(() => {
    if (defaultTheme === "system" && !serverTheme) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    }
  }, []);

  React.useEffect(() => {
    // do not set cookie when
    // servertheme is undefined
    // user has not changed the theme
    // and default theme is system
    if (!serverTheme && !__theme && defaultTheme === "system") return;
    Cookies.set({
      name: "swft-theme",
      value: theme,
      expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  }, [__theme]);

  React.useEffect(() => {
    console.log("initial render");

    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
      html.style.colorScheme = "dark";
      html.setAttribute("data-theme", "dark");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      html.setAttribute("data-theme", "light");
    }
  }, [theme]);

  function setThemes(theme: Theme) {
    setTheme(theme);
    __setTheme(theme);
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
