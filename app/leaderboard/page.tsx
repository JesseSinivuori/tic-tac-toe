import { Suspense } from "react";
import { getLeaderboard } from "../models/user/user.functions";
import { SeparatorHorizontal } from "../components/ui/separator";
import { Card } from "../components/ui/card";
import { LinkComponentBlue } from "../components/ui/link";

type User = {
  id: string;
  username: string | undefined;
  wins: number;
  losses: number;
  draws: number;
};

export default async function Leaderboard() {
  const users: User[] | undefined = await getLeaderboard();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Title />
      <p className="flex items-center justify-center hyphens-auto pb-6 text-zinc-950/75 dark:text-zinc-50/75">
        The top 100 multiplayer players.
      </p>
      <SeparatorHorizontal className="py-6" />
      <Suspense fallback={<div>loading...</div>}>
        {users?.map((user, index) => (
          <UserBoard key={user.id} user={user} index={index} />
        ))}
      </Suspense>
    </div>
  );
}

const Title = () => {
  return (
    <h1 className="flex w-full items-center justify-center py-8 text-center text-4xl font-extrabold">
      Top 100
    </h1>
  );
};

const UserBoard = ({ user, index }: { user: User; index: number }) => {
  const { wins, losses, draws, id } = user;
  const totalGames = wins + losses + draws;
  const winRatePercent = Math.floor(((wins || 0) / totalGames) * 100);
  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden py-1">
      <Card className="w-full overflow-hidden">
        <div
          className={`flex w-full flex-col items-center justify-center gap-6 rounded-md font-semibold xss:flex-row xss:flex-wrap `}
        >
          <div className="flex h-full w-full flex-1 flex-wrap items-center justify-around gap-3 font-medium text-zinc-950/90 dark:text-zinc-50/90 sm:flex-row">
            <div className="flex items-center gap-3 sm:gap-6 ">
              <div className="flex whitespace-nowrap ">#{index + 1}</div>
              <LinkComponentBlue href={`/game-history/${id}`} className="  ">
                {user.username}
              </LinkComponentBlue>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="flex whitespace-nowrap">
                Win Rate: {winRatePercent}%
              </div>
              <div className="flex whitespace-nowrap">
                Total Games: {totalGames}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="flex max-w-[140px] items-center justify-center whitespace-nowrap rounded-md bg-green-600 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-green-700">
                Wins: {wins}
              </div>
              <div className="flex max-w-[140px] items-center justify-center whitespace-nowrap rounded-md bg-red-700 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-red-600">
                Losses: {losses}
              </div>
              <div className="flex max-w-[140px] items-center justify-center whitespace-nowrap rounded-md bg-amber-500 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-amber-600">
                Draws: {draws}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
