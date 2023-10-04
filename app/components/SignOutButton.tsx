"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <Button type="button" className="!justify-start" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
