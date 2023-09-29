"use client";
import { useMobileMenuContext } from "@/app/providers/MobileMenuProvider";
import { UserAvatar } from "../UserAvatar";
import { UserName } from "./UserName";

export default function UserButton() {
  const { setMobileMenuIsOpen } = useMobileMenuContext();
  return (
    <button
      type="button"
      onClick={() => setMobileMenuIsOpen((prev) => !prev)}
      className="flex flex-row-reverse items-center justify-center gap-3 hover:opacity-75 sm:flex-row"
    >
      <UserName />
      <UserAvatar />
    </button>
  );
}
