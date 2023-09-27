"use client";
import type { Session } from "next-auth";
import { useMobileMenuContext } from "@/app/providers/MobileMenuProvider";
import { UserAvatar } from "../UserAvatar";
import { UserName } from "./UserName";

export default function UserButton({ session }: { session: Session | null }) {
  const { setMobileMenuIsOpen } = useMobileMenuContext();
  return (
    <button
      type="button"
      onClick={() => setMobileMenuIsOpen((prev) => !prev)}
      className="flex flex-row-reverse items-center justify-center gap-3 sm:flex-row"
    >
      <UserName />
      <UserAvatar session={session} />
    </button>
  );
}
