import { PaginationProps } from "../models/user/user.fetch";
import { LinkComponentOutline } from "./ui/link";

export function GameHistoryClient({
  pagination,
  children,
}: {
  pagination: PaginationProps;
  children: React.ReactNode;
}) {
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
