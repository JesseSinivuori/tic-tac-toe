"use client";
import { useState } from "react";
import { ThemeButtonEffects } from "./ThemeButtonEffects";

export function ThemeButtonClient({
  className,
  darkModeCookie,
  LightModeIcon,
  DarkModeIcon,
}: {
  className?: string;
  darkModeCookie: boolean;
  LightModeIcon: JSX.Element;
  DarkModeIcon: JSX.Element;
}) {
  const [darkMode, setDarkMode] = useState(darkModeCookie);

  const toggleDarkModeCookie = () => fetch("/api/theme", { method: "PATCH" });

  const handleToggleDarkMode = async () => {
    setDarkMode(!darkMode);
    toggleDarkModeCookie();
  };

  return (
    <>
      <button
        type="button"
        aria-label={`${
          darkMode ? "switch to light mode" : "switch to dark mode"
        }`}
        onClick={() => handleToggleDarkMode()}
        className={`${
          className ?? ""
        } p-2 rounded-md border dark:border-white/10 border-black/10`}
      >
        {darkMode ? LightModeIcon : DarkModeIcon}
      </button>
      <ThemeButtonEffects darkMode={darkMode} />
    </>
  );
}
