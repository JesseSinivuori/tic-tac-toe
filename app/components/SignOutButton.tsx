"use client";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function SignOutButton() {
  const handleSignOut = async () => {
    const signOutPromise = signOut();

    toast.promise(signOutPromise, {
      loading: "Signing out...",
      success: "Signed out!",
      error: "Sign out failed. Please try again.",
    });
  };

  return (
    <button
      type="button"
      className="flex whitespace-nowrap py-2 px-4 rounded-md border dark:border-white/10 border-black/10"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
