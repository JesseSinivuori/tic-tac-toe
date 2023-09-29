"use client";
import { useEffect } from "react";
import { useThemeContext } from "../providers/ThemeProvider";

export function ThemeButtonClient({
  className,
  LightModeIcon,
  DarkModeIcon,
}: {
  className?: string;
  LightModeIcon: JSX.Element;
  DarkModeIcon: JSX.Element;
}) {
  const { darkMode, setDarkMode } = useThemeContext();

  const handleToggleDarkMode = () => {
    setDarkModeCookie(!darkMode);
    toggleDarkModeOnClient(darkMode, setDarkMode);

    /**Make a channel for keeping the theme in sync with tabs/windows */
    const channel = new BroadcastChannel("darkMode");
    channel.postMessage(darkMode);
  };

  useEffect(() => {
    const syncThemeWithOtherTabs = (darkMode: boolean) => {
      toggleDarkModeOnClient(darkMode, setDarkMode);
    };

    const channel = new BroadcastChannel("darkMode");
    channel.addEventListener("message", (e) => {
      const darkMode = e.data;
      syncThemeWithOtherTabs(darkMode);
    });

    return () => {
      channel.close();
    };
  }, [setDarkMode]);

  return (
    <button
      type="button"
      aria-label={`${
        darkMode ? "switch to light mode" : "switch to dark mode"
      }`}
      onClick={() => handleToggleDarkMode()}
      className={`${className ?? ""} p-2 hover:opacity-75`}
    >
      {darkMode ? LightModeIcon : DarkModeIcon}
    </button>
  );
}

const setDarkModeCookie = (darkMode: boolean) => {
  fetch("/api/theme", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(darkMode),
  });
};

const toggleDarkModeOnClient = (
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const html = document.querySelector("html")!;

  setDarkMode(!darkMode);

  if (!darkMode) {
    html.style.colorScheme = "dark";
    html.classList.add("dark");
  } else {
    html.style.colorScheme = "light";
    html.classList.remove("dark");
  }
};
