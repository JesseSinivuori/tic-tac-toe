"use client";
import type { UserSchema } from "@/app/models/user/user.schema.zod";
import MobileMenuProvider from "@/app/providers/MobileMenuProvider";
import { useUser } from "@/app/providers/UserProvider";
import SignInButton from "../SignInButton";
import SignOutButton from "../SignOutButton";
import { UserAvatar } from "../UserAvatar";
import { SeparatorHorizontal } from "../ui/separator";
import MobileMenu from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { ThemeButton } from "./ThemeButton";
import { UpdateUsernameButton } from "./UpdateUsernameButton";
import UserButton from "./UserButton";
import { UserName } from "./UserName";

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
