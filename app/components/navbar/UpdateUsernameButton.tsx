"use client";
import { useState } from "react";
import { UsernameDialog } from "../UsernameDialog";
import { Button } from "../ui/button";

export function UpdateUsernameButton() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <div>
      <UsernameDialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
      />
      <Button
        className="w-full !justify-start"
        onClick={() => setDialogIsOpen(true)}
      >
        Change username
      </Button>
    </div>
  );
}
