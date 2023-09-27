"use client";
import { createContext, useContext, useState } from "react";

type MobileMenuProps = {
  mobileMenuIsOpen: boolean;
  setMobileMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null;

const MobileMenuContext = createContext<MobileMenuProps>(null);

export default function MobileMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState<boolean>(false);
  return (
    <MobileMenuContext.Provider
      value={{ mobileMenuIsOpen, setMobileMenuIsOpen }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export const useMobileMenuContext = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error(
      "useMobileMenuContext must be used within MobileMenuProvider",
    );
  }
  return context;
};
