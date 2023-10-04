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
      } flex flex-col rounded-md border border-zinc-950/10 bg-zinc-50 p-3 dark:border-zinc-50/10 dark:bg-zinc-950`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";
