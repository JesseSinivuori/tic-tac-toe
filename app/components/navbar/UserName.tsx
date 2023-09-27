"use client";
import { useUser } from "@/app/providers/UserProvider";

export function UserName({ ...props }: React.ComponentProps<"div">) {
  const { user } = useUser();
  return (
    <div className="flex" {...props}>
      {user?.username}
    </div>
  );
}
