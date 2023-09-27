import Link, { type LinkProps } from "next/link";
import { forwardRef } from "react";

type LinkComponentProps = {} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;
export const LinkComponent = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ className, children, href, ...props }: LinkComponentProps, ref) => {
    return (
      <Link
        href={href}
        ref={ref}
        className={` ${
          className || ""
        } flex whitespace-nowrap rounded-md px-3 py-2 text-zinc-950/90 outline-none ring-zinc-950/90 ring-offset-2 ring-offset-zinc-50 focus-visible:bg-zinc-50 focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-50/90 dark:ring-zinc-50/90 dark:ring-offset-zinc-950 dark:focus-visible:bg-zinc-950`}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
LinkComponent.displayName = "LinkComponent";

export const LinkComponentOutline = ({
  className,
  children,
  ...props
}: LinkComponentProps) => {
  return (
    <LinkComponent
      className={`border border-zinc-950/10 bg-zinc-50 !opacity-100 hover:bg-zinc-950/5 dark:border-zinc-50/10 dark:bg-zinc-950 dark:hover:bg-zinc-50/5 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </LinkComponent>
  );
};

export const LinkComponentBlue = ({
  className,
  children,
  ...props
}: LinkComponentProps) => {
  return (
    <LinkComponent
      className={` hover:text-blue-700  hover:dark:text-blue-600 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </LinkComponent>
  );
};

export const LinkComponentButtonGreen = ({
  className,
  children,
  ...props
}: LinkComponentProps) => {
  return (
    <LinkComponent
      className={`!border-green-700 !bg-green-700 !text-white/90 hover:!border-green-800 hover:!bg-green-800 dark:!border-green-800 dark:!bg-green-800 dark:hover:!border-green-700 dark:hover:!bg-green-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </LinkComponent>
  );
};

export const LinkComponentButtonRed = ({
  className,
  children,
  ...props
}: LinkComponentProps) => {
  return (
    <LinkComponent
      className={`!border-red-700 !bg-red-700 !text-white/90 hover:!border-red-800 hover:!bg-red-800 dark:!border-red-800 dark:!bg-red-800 dark:hover:!border-red-700 dark:hover:!bg-red-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </LinkComponent>
  );
};
