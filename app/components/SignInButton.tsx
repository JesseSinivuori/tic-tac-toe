"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      type="button"
      className="flex whitespace-nowrap py-2 px-4 dark:bg-green-700 bg-green-600 text-white rounded-md border dark:border-green-700 border-green-600"
      onClick={() => signIn("github", { redirect: false })}
    >
      Sign in with GitHub
    </button>
  );
}
