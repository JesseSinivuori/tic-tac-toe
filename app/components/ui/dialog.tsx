import { forwardRef } from "react";

export type DialogProps = {} & React.ComponentPropsWithRef<"dialog">;

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ className, children, ...props }: DialogProps, ref) => {
    return (
      <dialog ref={ref} className={`${className || ""}`} {...props}>
        {children}
      </dialog>
    );
  },
);
Dialog.displayName = "Dialog";
