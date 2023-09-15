"use client";
import { useState } from "react";

export default function MobileMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  return (
    <div className="flex sm:hidden">
      <MobileMenuButton onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}>
        <MobileMenuOpenIcon />
      </MobileMenuButton>
      {mobileMenuIsOpen && (
        <div
          onClick={() => setMobileMenuIsOpen(false)}
          className="fixed top-0 left-0 w-full h-full z-[9998]"
        ></div>
      )}
      <div
        className={`${
          mobileMenuIsOpen
            ? "fixed w-screen h-screen z-[9999] bg-white"
            : "hidden"
        } flex-col fixed right-0 top-0 bottom-0 max-w-[240px] w-full h-full dark:bg-zinc-950 bg-zinc-50 border-l dark:border-white/10 border-black/10`}
      >
        <div className="flex justify-start items-stretch gap-4 flex-col h-full w-full p-4">
          <MobileMenuButton
            onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}
          >
            <MobileMenuCloseIcon />
          </MobileMenuButton>
          <div className="py-2 border-t dark:border-white/10 border-black/10"></div>
          {children}
        </div>
      </div>
    </div>
  );
}

const MobileMenuOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const MobileMenuCloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const MobileMenuButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 flex justify-start border dark:border-white/10 border-black/10 rounded-md "
  >
    {children}
  </button>
);
