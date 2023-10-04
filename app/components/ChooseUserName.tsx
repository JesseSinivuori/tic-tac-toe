"use client";

import { useRef, useState } from "react";
import { Button, ButtonGreen } from "./ui/button";
import { InputWithLabel } from "./ui/inputWithLabel";
import { ZodError } from "zod";
import { UserSchema, usernameSchema } from "../models/user/user.schema.zod";
import { fetchUpdateUsername } from "../models/user/user.fetch";
import { useUser } from "../providers/UserProvider";
import { Card } from "./ui/card";

//change button text with children prop
type ChooseUserNameProps = {
  closeButtonProps?: React.ComponentPropsWithRef<"button">;
  doneButtonProps?: React.ComponentPropsWithRef<"button">;
};

export default function ChooseUserName({
  closeButtonProps,
  doneButtonProps,
  ...props
}: ChooseUserNameProps & React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const { user, setUser } = useUser();

  if (!user) return;

  const handleClickDone = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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
      if (doneButtonProps?.onClick) {
        doneButtonProps?.onClick(e);
      }
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
    <div className="flex flex-col " {...props}>
      <Card className="px-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`flex flex-col gap-4 pt-8 ${loading && "animate-pulse"}`}
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
            <Button type="button" className="w-full" {...closeButtonProps}>
              {closeButtonProps?.children ? closeButtonProps.children : "Close"}
            </Button>
            <ButtonGreen
              disabled={loading}
              type="submit"
              className="w-full"
              {...doneButtonProps}
              onClick={(e) => handleClickDone(e)}
            >
              {doneButtonProps?.children ? doneButtonProps.children : "Done"}
            </ButtonGreen>
          </div>
          <p className="flex w-full text-sm opacity-50">
            Username is required for match history and leaderboard.
          </p>
          <p className="flex w-full items-center justify-center text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        </form>
      </Card>
    </div>
  );
}
