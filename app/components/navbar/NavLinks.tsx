import { LinkComponent } from "../ui/link";
import { HistoryLink } from "./HistoryLink";

export const NavLinks = () => {
  return (
    <>
      <LinkComponent href={`/leaderboard`}>Leaderboard</LinkComponent>
      <HistoryLink />
    </>
  );
};
