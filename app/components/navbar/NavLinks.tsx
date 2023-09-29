import { LinkComponent } from "../ui/link";
import { HistoryLink } from "./HistoryLink";

export const NavLinks = () => {
  return (
    <>
      <LinkComponent href={`/test`}>Test</LinkComponent>
      <LinkComponent href={`/leaderboard`}>Leaderboard</LinkComponent>

      <HistoryLink />
    </>
  );
};
