// src/theme/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      100: "#e3f2fd",
      500: "#2196f3",
      900: "#0b3954",
    },
  },
  styles: {
    global: {
      body: {
        fontFamily: "Arial, sans-serif",
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});

export default theme;
