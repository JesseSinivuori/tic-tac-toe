import { forwardRef } from "react";

export type DialogProps = {} & React.ComponentPropsWithRef<"dialog">;

export const Input = forwardRef<HTMLDialogElement, DialogProps>(
  ({ className, ...props }: DialogProps, ref) => {
    return (
      <dialog
        ref={ref}
        className={`${className || ""} 
         flex h-10 w-full rounded-md border border-zinc-950/10 bg-zinc-50 px-4 py-2 text-base text-zinc-950/90 outline-none ring-zinc-950/90 ring-offset-2 ring-offset-zinc-50 file:rounded-md file:border file:border-zinc-50/10 file:bg-transparent file:text-sm placeholder:text-zinc-950/75 focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-50/10 dark:bg-zinc-950 dark:text-zinc-50/90 dark:ring-zinc-50/90 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-50/75`}
        {...props}
      ></dialog>
    );
  },
);
Input.displayName = "Input";
