"use client";
import { useUser } from "@/app/providers/UserProvider";
import { LinkComponent } from "../ui/link";

export function HistoryLink() {
  const { user } = useUser();
  if (!user) return;
  return (
    <LinkComponent href={`/game-history/${user?.id}`}>History</LinkComponent>
  );
}
