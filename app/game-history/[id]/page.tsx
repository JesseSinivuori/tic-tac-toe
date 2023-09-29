import {
  GameSchema,
  PlayerSchema,
  PopulatedPlayerSchema,
  UsernameSchema,
} from "@/app/models/user/user.schema.zod";
import {
  PaginationProps,
  fetchUserWithGameHistory,
} from "../../models/user/user.fetch";
import { SeparatorHorizontal } from "@/app/components/ui/separator";
import {
  LinkComponentBlue,
  LinkComponentOutline,
} from "@/app/components/ui/link";
import { Card } from "@/app/components/ui/card";
import ChooseUserName from "@/app/components/ChooseUserName";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

const getPopulatedPlayer = (player: PlayerSchema): PopulatedPlayerSchema => {
  return {
    id: typeof player.userId !== "string" && player.userId.id,
    username: typeof player.userId !== "string" && player.userId.username,
  } as unknown as PopulatedPlayerSchema;
};

export default async function History({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page, limit } = searchParams;
  const pageAsNumber = Number(page) || 1;
  const limitAsNumber = Number(limit) || 10;
  const data = await fetchUserWithGameHistory(id, pageAsNumber, limitAsNumber);

  if (!data) return <Loading />;
  const { gameHistory, username } = data.user;

  if (!username) {
    return <ChooseUserName />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col">
        <Title username={username} />
        <p className="flex items-center justify-center hyphens-auto text-zinc-950/75 dark:text-zinc-50/75">
          Match history currently only supports multiplayer.
        </p>
      </div>
      <Stats
        wins={gameHistory?.wins}
        losses={gameHistory?.losses}
        draws={gameHistory?.draws}
        totalGames={data.pagination.totalGames}
      />

      <div className="flex w-full flex-col pt-6">
        <SeparatorHorizontal className="py-6" />
        {gameHistory?.games.map((game) => (
          <Game
            {...game}
            winnerId={game.winnerId?.toString()}
            loserId={game.loserId?.toString()}
            username={username}
            userId={id}
            key={game.date?.toString()}
            player1={{
              ...game.player1,
              userId: getPopulatedPlayer(game.player1),
            }}
            player2={{
              ...game.player2,
              userId: getPopulatedPlayer(game.player2),
            }}
          />
        ))}
      </div>
      <PaginationButtons id={id} limit={limitAsNumber} {...data.pagination} />
    </div>
  );
}
type PaginationButtonsProps = {
  id: string;
  limit: number;
} & PaginationProps;

const PaginationButtons = ({
  currentPage,
  totalPages,
  id,
  limit,
}: PaginationButtonsProps) => {
  const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;

  if (!totalPages || totalPages === 1) return null;

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 whitespace-nowrap pt-16">
      <LinkComponentOutline
        href={`/game-history/${id}/?page=${prevPage}&limit=${limit}`}
        replace={true}
        scroll={false}
      >
        Previous
      </LinkComponentOutline>
      <div className="flex items-center justify-center px-3 text-zinc-950/75 dark:text-zinc-50/75">
        {currentPage} of {totalPages}
      </div>
      <LinkComponentOutline
        href={`/game-history/${id}/?page=${nextPage}&limit=${limit}`}
        replace={true}
        scroll={false}
      >
        Next
      </LinkComponentOutline>
    </div>
  );
};

type GameProps = GameSchema & {
  userId: string;
  player1: { userId: PopulatedPlayerSchema };
  player2: { userId: PopulatedPlayerSchema };
  username: UsernameSchema | undefined;
};

const Game = ({
  winnerId,
  isDraw,
  userId,
  loserId,
  player1,
  player2,
  date,
  username,
}: GameProps) => {
  const gamePlayedDaysAgo = daysAgo(new Date(date!));
  const winner = userId === winnerId;
  const loser = userId === loserId;
  const playerMark = userId === player1.userId.id ? player1.mark : player2.mark;
  const opponentMark =
    userId !== player1.userId.id ? player1.mark : player2.mark;
  const opponentUserId =
    userId === player1.userId.id ? player2.userId.id : player1.userId.id;
  const opponentUsername =
    username === player1.userId.username
      ? player2.userId.username
      : player1.userId.username;

  const ResultText = () => {
    if (winner)
      return (
        <div className="flex w-[70px] items-center justify-center rounded-md bg-green-600 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-green-700">
          Won
        </div>
      );
    if (loser)
      return (
        <div className="flex w-[70px] items-center justify-center rounded-md bg-red-700 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-red-600">
          Lost
        </div>
      );
    if (isDraw)
      return (
        <div className="flex w-[70px] items-center justify-center rounded-md bg-amber-500 px-3 py-1 text-lg font-bold text-zinc-50/90 dark:bg-amber-600">
          Draw
        </div>
      );
  };

  return (
    <div className="flex w-full flex-col items-center justify-center py-1">
      <Card className="max-w-[800px] ">
        <div
          className={`flex w-full flex-col items-center justify-center gap-6 whitespace-nowrap  rounded-md font-semibold xss:flex-row xss:flex-wrap `}
        >
          <ResultText />
          <div className="flex h-full w-full flex-1 flex-col items-center justify-around gap-3 whitespace-nowrap font-medium text-zinc-950/90 dark:text-zinc-50/90 sm:flex-row">
            <div className="flex items-center">
              <LinkComponentBlue
                href={`/game-history/${userId}`}
                className="!p-0"
              >
                {username}
              </LinkComponentBlue>
              <span className="">{`${": "}${playerMark}`}</span>
            </div>
            <span className="flex items-center justify-center">vs</span>
            <div className="flex items-center">
              <LinkComponentBlue
                href={`/game-history/${opponentUserId}`}
                className="!p-0"
              >
                {opponentUsername}
              </LinkComponentBlue>
              <span>{`${": "}${opponentMark}`}</span>
            </div>
          </div>
          <div className="flex min-w-[100px] items-center justify-center text-sm text-zinc-950/75 dark:text-zinc-50/75">
            {gamePlayedDaysAgo}
          </div>
        </div>
      </Card>
    </div>
  );
};

const Title = ({ username }: { username: UsernameSchema | undefined }) => {
  return (
    <h1 className="flex w-full items-center justify-center py-8 text-center text-4xl font-extrabold">
      {`${username && `${username}'s `}`}
      Match History
    </h1>
  );
};

type StatsProps = {
  wins: number | undefined;
  losses: number | undefined;
  draws: number | undefined;
  totalGames: number;
};
const Stats = ({ wins, losses, draws, totalGames }: StatsProps) => {
  const winRatePercent = Math.floor(((wins || 0) / totalGames) * 100);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 pt-6 sm:gap-6">
      <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-6">
        <div className="flex w-1/4 min-w-[100px] flex-1 flex-col items-center justify-center rounded-md bg-green-600 p-1 !text-zinc-50/90 dark:bg-green-700">
          <h2 className="text-xl font-bold">Wins</h2>
          <p className="text-xl font-extrabold ">{wins}</p>
        </div>

        <div className="flex w-1/4 min-w-[100px] flex-1 flex-col items-center justify-center rounded-md bg-red-700 p-1 !text-zinc-50/90 dark:bg-red-600 ">
          <h2 className="text-xl font-bold">Losses</h2>
          <p className="text-xl font-extrabold ">{losses}</p>
        </div>
        <div className="flex w-1/4 min-w-[100px] flex-1 flex-col items-center justify-center rounded-md  bg-amber-500 p-1 !text-zinc-50/90 dark:bg-amber-600">
          <h2 className="text-xl font-bold">Draws</h2>
          <p className="text-xl font-extrabold ">{draws}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex w-full min-w-[100px] flex-1 flex-col items-center justify-center rounded-md p-1 !text-zinc-50/90 ">
          <h2 className="whitespace-nowrap text-xl font-bold text-zinc-950/90 dark:text-zinc-50/90">
            Win Rate
          </h2>
          <p
            className={`text-xl font-extrabold text-zinc-950/90 dark:text-zinc-50/90`}
          >
            {winRatePercent ? `${winRatePercent}%` : "-"}
          </p>
        </div>
        <div className="flex w-full min-w-[100px] flex-1 flex-col items-center justify-center rounded-md p-1 !text-zinc-50/90 ">
          <h2 className="whitespace-nowrap text-xl font-bold text-zinc-950/90 dark:text-zinc-50/90">
            Total Games
          </h2>
          <p
            className={`text-xl font-extrabold text-zinc-950/90 dark:text-zinc-50/90`}
          >
            {totalGames ? `${totalGames}` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

const daysAgo = (pastDate: Date) => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - pastDate.getTime();

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  }
  if (timeDifference < day) {
    const hoursAgo = Math.floor(timeDifference / hour);
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else {
    const dayAgo = Math.floor(timeDifference / day);
    return `${dayAgo} day${dayAgo === 1 ? "" : "s"} ago`;
  }
};
