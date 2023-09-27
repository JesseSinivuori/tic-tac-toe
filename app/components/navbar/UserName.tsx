"use client";
import { useUser } from "@/app/providers/UserProvider";

export function UserName({ ...props }: React.ComponentProps<"div">) {
  const { user } = useUser();
  return (
    <div className="flex text-zinc-950/90 dark:text-zinc-50/90" {...props}>
      {user?.username}
    </div>
  );
}
