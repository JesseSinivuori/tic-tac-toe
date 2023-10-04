export const SeparatorHorizontal = ({
  lineProps,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  lineProps?: React.ComponentProps<"div">;
}) => {
  return (
    <div className={`${className || ""} w-full py-1`} {...props}>
      <div
        {...lineProps}
        className={`${lineProps?.className} h-[1px] w-full bg-zinc-950/10 dark:bg-zinc-50/10`}
      ></div>
    </div>
  );
};
