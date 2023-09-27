import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { PaginationProps } from "../models/user/user.fetch";
import { LinkComponent, LinkComponentOutline } from "./ui/link";

export function GameHistoryClient({
  pagination,
  children,
}: {
  pagination: PaginationProps;
  children: React.ReactNode;
}) {
  console.log("🚀 ~ file: GameHistoryClient.tsx:14 ~ pagination:", pagination);

  const PaginationButtons = () => {
    return (
      <div className="flex gap-3 pt-16">
        <LinkComponentOutline href={""}>Previous</LinkComponentOutline>
        <div className="text- flex items-center justify-center px-3">
          {pagination.currentPage} of {pagination.totalPages}
        </div>
        <LinkComponentOutline href={""}>Next</LinkComponentOutline>
      </div>
    );
  };

  return (
    <>
      {children}
      <PaginationButtons />
    </>
  );
}
