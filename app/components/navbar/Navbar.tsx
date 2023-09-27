import SignOutButton from "../SignOutButton";
import { Session, getServerSession } from "next-auth";
import SignInButton from "../SignInButton";
import { ThemeButton } from "../ThemeButton";
import MobileMenu from "./MobileMenu";
import UserButton from "./UserButton";
import MobileMenuProvider from "@/app/providers/MobileMenuProvider";
import { UserAvatar } from "../UserAvatar";
import { SeparatorHorizontal } from "../ui/separator";
import { LinkComponent } from "../ui/link";
import { NavLinks } from "./NavLinks";
import { UserName } from "./UserName";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <div className="relative flex h-full w-full max-w-[1000px] flex-col items-center justify-center px-3">
      <div className="flex w-full items-center justify-center gap-3 border-b border-zinc-950/10 p-3 dark:border-zinc-50/10">
        <MobileMenuProvider>
          <div className="flex w-full items-center justify-start">
            <LinkComponent href="/" className="font-medium">
              .j<span className="text-green-600">s</span>
            </LinkComponent>
          </div>
          <div className="hidden sm:flex">
            <div className="flex w-full items-center justify-end gap-3">
              <NavLinks />
              <ThemeButton />
              {!session ? <SignInButton /> : <UserButton session={session} />}
            </div>
          </div>
          <MobileMenu>
            <NavLinksMobile session={session}>
              <NavLinks />
            </NavLinksMobile>
          </MobileMenu>
        </MobileMenuProvider>
      </div>
    </div>
  );
}

const NavLinksMobile = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => (
  <>
    {children}
    <ThemeButton className="rounded-md border border-zinc-950/10 dark:border-zinc-50/10" />
    <SeparatorHorizontal />

    {!session ? (
      <SignInButton />
    ) : (
      <>
        <div className="flex w-full items-center justify-start py-2">
          <UserAvatar session={session} />
          <div className=" flex items-center justify-start pl-2">
            <UserName />
          </div>
        </div>
        <SignOutButton />
      </>
    )}
  </>
);
