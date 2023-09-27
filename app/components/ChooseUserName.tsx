"use client";

import { useRef, useState } from "react";
import { Button, ButtonGreen } from "./ui/button";
import { InputWithLabel } from "./ui/inputWithLabel";
import { ZodError } from "zod";
import { UserSchema, usernameSchema } from "../models/user/user.schema.zod";
import { fetchUpdateUsername } from "../models/user/user.fetch";
import { useUser } from "../providers/UserProvider";

export default function ChooseUserName() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const { user, setUser } = useUser();

  if (!user) return;

  const handleClickDone = async () => {
    try {
      setError("");
      setLoading(true);
      const newUsername = nameRef.current?.value;

      usernameSchema.parse(newUsername);

      const newUser: UserSchema = {
        ...user,
        username: newUsername,
      };

      await fetchUpdateUsername(newUser);
      setUser(newUser);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      if (error instanceof ZodError) {
        console.error(error.message);
        setError(error.errors[0].message);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`flex flex-col gap-4 py-8 ${loading && "animate-pulse"}`}
      >
        <InputWithLabel
          inputProps={{
            ref: nameRef,
            placeholder: "Username",
            type: "text",
            id: "username",
          }}
          labelProps={{
            children: "Username",
            htmlFor: "username",
          }}
        />
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            type="button"
            className="w-full"
            disabled
            title="This feature is not implemented yet."
          >
            Skip
          </Button>
          <ButtonGreen
            disabled={loading}
            type="submit"
            onClick={handleClickDone}
            className="w-full"
          >
            Done
          </ButtonGreen>
        </div>
        <p className="flex w-full text-sm opacity-50">
          Username is required for match history and leaderboard.
        </p>
        <p className="flex w-full items-center justify-center text-sm text-red-600 dark:text-red-500">
          {error}
        </p>
      </form>
    </div>
  );
}
