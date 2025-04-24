"use client";

import { Cookies } from "@/lib/helpers";
import React from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  const [resolvedTheme, setTheme] = React.useState<Theme>(theme ?? "light");

  React.useEffect(() => {
    console.log("run on start");
    Cookies.set({
      name: "theme",
      value: resolvedTheme,
      expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    const html = document.documentElement;

    if (resolvedTheme === "dark") {
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
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, setTheme }}>
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
