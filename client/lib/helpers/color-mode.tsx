"use client";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { useTheme as useThemes } from "@/components/Providers/ThemeProvider";
import React from "react";
import { MoonIcon, SunIcon } from "../icons";

export type Theme = "light" | "dark";

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme } = useThemes();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return {
    theme,
    setTheme,
    toggleTheme
  };
}

export function useThemeValue<T>(light: T, dark: T) {
  const { theme } = useTheme();
  return theme === "dark" ? dark : light;
}

export function ThemeIcon() {
  const { theme } = useTheme();
  return theme === "dark" ? (
    <MoonIcon color="{colors.primaryText}" />
  ) : (
    <SunIcon color="{colors.primaryText}" />
  );
}

type ThemeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ThemeButton = React.forwardRef<
  HTMLButtonElement,
  ThemeButtonProps
>(function ThemeButton(props, ref) {
  const { toggleTheme } = useTheme();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={() => toggleTheme()}
        variant="plain"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5"
          }
        }}>
        <ThemeIcon />
      </IconButton>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  }
);
