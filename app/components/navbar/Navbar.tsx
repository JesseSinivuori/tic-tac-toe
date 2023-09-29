import { LinkComponent } from "../ui/link";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav className="relative flex h-full w-full max-w-[1000px] flex-col items-center justify-center px-3">
      <div className="flex w-full items-center justify-center gap-3 border-b border-zinc-950/10 px-3 py-2 dark:border-zinc-50/10">
        <div className="flex w-full items-center justify-start">
          <LinkComponent href="/" className="font-medium">
            .j<span className="text-green-600">s</span>
          </LinkComponent>
        </div>
        <NavbarClient />
      </div>
    </nav>
  );
}
