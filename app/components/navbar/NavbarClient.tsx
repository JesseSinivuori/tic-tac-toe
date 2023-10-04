"use client";
import SignInButton from "../SignInButton";
import { ThemeButton } from "./ThemeButton";
import MobileMenu from "./MobileMenu";
import UserButton from "./UserButton";
import MobileMenuProvider from "@/app/providers/MobileMenuProvider";
import { NavLinks } from "./NavLinks";
import { useUser } from "@/app/providers/UserProvider";
import { SeparatorHorizontal } from "../ui/separator";
import { UserAvatar } from "../UserAvatar";
import { UserName } from "./UserName";
import SignOutButton from "../SignOutButton";
import { UserSchema } from "@/app/models/user/user.schema.zod";
import { UpdateUsernameButton } from "./UpdateUsernameButton";

export default function NavbarClient() {
  const { user } = useUser();
  return (
    <MobileMenuProvider>
      <div className="hidden sm:flex">
        <div className="flex w-full items-center justify-end gap-3">
          <NavLinks />
          <ThemeButton />
          {!user ? <SignInButton /> : <UserButton />}
        </div>
      </div>
      <MobileMenu>
        <NavLinksMobile user={user}>
          <NavLinks />
        </NavLinksMobile>
      </MobileMenu>
    </MobileMenuProvider>
  );
}

const NavLinksMobile = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserSchema | null;
}) => (
  <>
    {children}
    <SeparatorHorizontal />
    {!user ? (
      <SignInButton />
    ) : (
      <>
        <ThemeButton className="rounded-md border border-zinc-950/10 dark:border-zinc-50/10" />
        <UpdateUsernameButton />
        <div className="flex w-full items-center justify-start py-2">
          <UserAvatar />
          <div className=" flex items-center justify-start pl-2">
            <UserName />
          </div>
        </div>

        <SignOutButton />
      </>
    )}
  </>
);
