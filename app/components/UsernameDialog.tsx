"use client";
import { useEffect, useRef } from "react";
import ChooseUserName from "./ChooseUserName";
import { Dialog } from "./ui/dialog";

type UsernameDialog = {
	open: boolean; //open programmatically
	close?: boolean; //close programmatically
	onClose?: () => void; //triggers on close
};

export function UsernameDialog({ open, close, onClose }: UsernameDialog) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		dialogRef.current = document.getElementById(
			"username-dialog",
		) as HTMLDialogElement;
	}, []);

	const closeDialog = () => dialogRef.current?.close();
	const openDialog = () => dialogRef.current?.showModal();

	// biome-ignore lint/correctness/useExhaustiveDependencies: -
	useEffect(() => {
		if (open) {
			openDialog();
		}
	}, [open]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: -
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
			{/** biome-ignore lint/a11y/noStaticElementInteractions: - */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: - */}
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
