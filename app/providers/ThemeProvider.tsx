"use client";
import { createContext, useContext, useState } from "react";

type MobileMenuProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
} | null;

const ThemeProviderContext = createContext<MobileMenuProps>(null);

export default function ThemeProvider({
  children,
  darkModeCookie,
}: {
  children: React.ReactNode;
  darkModeCookie: boolean;
}) {
  const [darkMode, setDarkMode] = useState<boolean>(darkModeCookie);

  return (
    <ThemeProviderContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
