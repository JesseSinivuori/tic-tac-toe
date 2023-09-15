import SignOutButton from "../SignOutButton";
import { Session, getServerSession } from "next-auth";
import SignInButton from "../SignInButton";
import { ThemeButton } from "../ThemeButton";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <div className="w-full h-full justify-center gap-4 items-center max-w-[1000px] flex border-b dark:border-white/10 border-black/10 p-4">
      <div className="flex w-full justify-start items-center">
        <Link href="/" className="p-2 font-medium">
          .j<span className="text-green-600">s</span>
        </Link>
      </div>
      <div className="sm:flex hidden">
        <div className="flex w-full justify-end items-center gap-4">
          <NavLinks session={session} />
        </div>
      </div>
      <MobileMenu>
        <NavLinks session={session} />
      </MobileMenu>
    </div>
  );
}

const NavLinks = ({ session }: { session: Session | null }) => {
  return (
    <>
      <ThemeButton />
      {!session ? <SignInButton /> : <SignOutButton />}
    </>
  );
};
