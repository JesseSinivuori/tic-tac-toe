"use client";

import { useEffect } from "react";

export function ThemeButtonEffects({ darkMode }: { darkMode: boolean }) {
  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      if (darkMode) {
        html.style.colorScheme = "dark";
        html.style.backgroundColor = "var(--color-primary)";
        html.classList.add("dark");
      } else {
        html.style.colorScheme = "light";
        html.style.backgroundColor = "var(--color-light)";
        html.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return null;
}
