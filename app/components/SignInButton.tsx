"use client";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function SignInButton() {
  const handleSignIn = async () => {
    const signInPromise = signIn("github", { redirect: false });

    toast.promise(signInPromise, {
      loading: "Signing in...",
      success: "Signed in!",
      error: "Sign in failed. Please try again.",
    });
  };

  return (
    <button
      type="button"
      className="flex whitespace-nowrap py-2 px-4 dark:bg-green-700 bg-green-600 text-white rounded-md border dark:border-green-700 border-green-600"
      onClick={handleSignIn}
    >
      Sign in with GitHub
    </button>
  );
}
