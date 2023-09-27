import { forwardRef } from "react";

type ButtonProps = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }: ButtonProps, ref) => {
    return (
      <button
        ref={ref}
        className={` ${
          className || ""
        } flex items-center justify-center whitespace-nowrap rounded-md border border-zinc-950/10 bg-zinc-50 px-3 py-2 text-zinc-950/90 outline-none ring-zinc-950/90 ring-offset-2 ring-offset-zinc-50 hover:bg-zinc-950/5 focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-50/10 dark:bg-zinc-950 dark:text-zinc-50/90 dark:ring-zinc-50/90 dark:ring-offset-zinc-950 dark:hover:bg-zinc-50/5`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export const ButtonGreen = ({ className, children, ...props }: ButtonProps) => {
  return (
    <Button
      className={`!border-green-700 !bg-green-700 !text-white/90 hover:!border-green-800 hover:!bg-green-800 dark:!border-green-800 dark:!bg-green-800 dark:hover:!border-green-700 dark:hover:!bg-green-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ButtonRed = ({ className, children, ...props }: ButtonProps) => {
  return (
    <Button
      className={`!border-red-700 !bg-red-700 !text-white/90 hover:!border-red-800 hover:!bg-red-800 dark:!border-red-800 dark:!bg-red-800 dark:hover:!border-red-700 dark:hover:!bg-red-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </Button>
  );
};
