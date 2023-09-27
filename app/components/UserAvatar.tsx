import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserAvatar = ({ session }: { session: Session | null }) => (
  <div className="flex items-center justify-center">
    <Avatar className="border border-black/10 dark:border-white/10">
      <AvatarImage src={session?.user?.image || ""} />
      <AvatarFallback className="animate-pulse"></AvatarFallback>
    </Avatar>
  </div>
);
