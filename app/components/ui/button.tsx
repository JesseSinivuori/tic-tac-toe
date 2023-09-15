"use client";
export default function Button({
  onClick,
  className,
  children,
  ...props
}: {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        className && className
      } border px-4 py-2 rounded-md dark:border-white/10 border-black/10`}
      {...props}
    >
      {children}
    </button>
  );
}
