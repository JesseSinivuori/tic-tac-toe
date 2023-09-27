"use client";
import { signIn } from "next-auth/react";
import { ButtonGreen } from "./ui/button";

export default function SignInButton() {
  const handleSignIn = () => {
    signIn("github");
  };
  return (
    <ButtonGreen type="button" onClick={handleSignIn}>
      Sign in with GitHub
    </ButtonGreen>
  );
}
