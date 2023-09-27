import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement>
>(
  (
    { className, children, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>,
    ref,
  ) => (
    <div
      ref={ref}
      className={`${
        className || ""
      } flex w-full flex-col rounded-md border border-zinc-950/10 p-3 dark:border-zinc-50/10`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";
