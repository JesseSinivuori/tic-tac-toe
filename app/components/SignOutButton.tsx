"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      className="flex whitespace-nowrap py-2 px-4 rounded-md border dark:border-white/10 border-black/10"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}
