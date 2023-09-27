import { forwardRef } from "react";

export type LabelProps = {} & React.ComponentPropsWithRef<"label">;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }: LabelProps, ref) => {
    return (
      <label
        ref={ref}
        className={`${className || ""} 
      flex text-zinc-950/90 dark:text-zinc-50/90`}
        {...props}
      >
        {children}
      </label>
    );
  },
);
Label.displayName = "Label";
