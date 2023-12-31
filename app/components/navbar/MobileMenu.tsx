"use client";
import { useMobileMenuContext } from "@/app/providers/MobileMenuProvider";
import { SeparatorHorizontal } from "../ui/separator";
import { useEffect } from "react";
import { Button } from "../ui/button";

export default function MobileMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useMobileMenuContext();

  const handleToggleMobileMenu = () => {
    setMobileMenuIsOpen(!mobileMenuIsOpen);
  };

  useEffect(() => {
    const body = document.body;
    if (mobileMenuIsOpen) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }, [mobileMenuIsOpen]);

  return (
    <div className="flex">
      <Button onClick={handleToggleMobileMenu} className="!p-2 sm:hidden">
        <MobileMenuOpenIcon />
      </Button>
      {mobileMenuIsOpen && (
        <div
          onClick={handleToggleMobileMenu}
          className="fixed inset-0 z-[9997] h-full w-full"
        ></div>
      )}
      <div
        className={`${
          mobileMenuIsOpen
            ? "absolute bottom-0 top-0 h-full min-h-screen w-full overflow-hidden"
            : "hidden"
        }  bottom-0 right-0 top-0 z-[9999] h-full min-h-screen w-full max-w-[280px] flex-col border-l border-r border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950`}
      >
        <aside className="absolute bottom-0 right-0 top-0 flex h-full min-h-screen w-full flex-col items-stretch justify-start gap-3 overflow-hidden overflow-y-auto px-2 py-3 ">
          <Button onClick={handleToggleMobileMenu} className="!justify-start">
            <MobileMenuCloseIcon />
          </Button>
          <SeparatorHorizontal />
          {children}
        </aside>
      </div>
    </div>
  );
}

const MobileMenuOpenIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`h-6 w-6 ${className || ""} hover:opacity-75`}
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
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
