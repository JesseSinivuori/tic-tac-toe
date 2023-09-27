export const SeparatorHorizontal = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={`${
        className || ""
      } w-full border-t border-zinc-950/10 py-1 dark:border-zinc-50/10`}
      {...props}
    ></div>
  );
};
