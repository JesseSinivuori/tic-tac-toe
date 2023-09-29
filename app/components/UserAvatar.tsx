import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";

export const UserAvatar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-center">
      <Avatar className="border border-black/10 dark:border-white/10">
        <AvatarImage src={session?.user?.image || ""} />
        <AvatarFallback className="animate-pulse"></AvatarFallback>
      </Avatar>
    </div>
  );
};
