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
      } border p-2 rounded-md border-white/10`}
      {...props}
    >
      {children}
    </button>
  );
}
