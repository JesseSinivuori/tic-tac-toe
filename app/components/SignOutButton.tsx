"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      className="flex whitespace-nowrap rounded-md border border-black/10 px-4 py-2 hover:opacity-75 dark:border-white/10"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}
