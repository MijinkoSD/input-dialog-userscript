/// <reference no-default-lib="true" />
/// <reference lib="es2022" />

import { Style } from "./deps.ts";

export const alertStyle: Style = {
  "#background": {
    "position": "fixed",
    "z-index": 2000,
    "top": "40px",
    "width": "100%",
    "height": "100%",
    "background-color": "hsl(0deg 0% 0% / 50%)",
  },
  ".alert-bg": {
    "position": "absolute",
    "display": "block",
    "width": "100%",
    "height": "100%",
    "background-color": "transparent",
  },
  ".container": {
    "position": "absolute",
    "display": "flex",
    "max-width": "50em",
    "top": "60px",
    "left": "1em",
    "right": "1em",
    "margin": "auto",
    "padding": "1em 1.2em 1.2em",
    "font-size": "15px",
    "border": "1px solid black",
    "border-radius": "10px",
    "flex-direction": "column",
    "background-color": "hsl(0deg 0% 100% / 85%)",

    ".title": {
      "margin": "0 0 5px",
      "font-size": "1.2em",
      "font-weight": 900,
    },
    ".description": {
      "margin": "0 0 5px",
    },
    ".input-area": {
      "textarea": {
        "width": "100%",
        "height": "5em",
      },
    },
    ".button-area": {
      "display": "flex",
      "flex-direction": "row",
      "justify-content": "space-evenly",
      "button": {
        "padding": "5px",
        "min-width": "5em",
        "border": "solid 2px hsl(0deg 0% 42%)",
        "border-radius": "10px",
      },
    },
  },
};
