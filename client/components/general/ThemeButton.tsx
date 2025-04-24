"use client";

import { Button } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

function ThemeButton() {
  return (
    <Button
      //   onClick={() => toggleTheme()}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      // ref={ref}
      // {...props}]
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <LuSearch />
    </Button>
  );
}

export default ThemeButton;
