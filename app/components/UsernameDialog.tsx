"use client";
import { useEffect, useRef } from "react";
import { Dialog } from "./ui/dialog";
import ChooseUserName from "./ChooseUserName";

type UsernameDialog = {
  open: boolean; //open programmatically
  close?: boolean; //close programmatically
  onClose?: () => void; //triggers on close
};

export function UsernameDialog({ open, close, onClose }: UsernameDialog) {
  const dialogRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    dialogRef.current = document.getElementById(
      "username-dialog",
    ) as HTMLDialogElement;
  }, []);

  const closeDialog = () => dialogRef.current?.close();
  const openDialog = () => dialogRef.current?.showModal();

  useEffect(() => {
    if (open) {
      openDialog();
    }
  }, [open]);

  useEffect(() => {
    if (close) {
      closeDialog();
    }
  }, [close, onClose]);

  const handleClose = () => {
    closeDialog();

    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      className="relative h-full w-full bg-transparent backdrop:bg-transparent"
      id="username-dialog"
    >
      <div
        className="absolute z-0 flex h-full w-full"
        onClick={() => handleClose()}
      ></div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="z-10 bg-zinc-50 dark:bg-zinc-950">
          <ChooseUserName
            closeButtonProps={{ onClick: () => handleClose() }}
            doneButtonProps={{
              onClick: () => handleClose(),
              children: "Update",
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
