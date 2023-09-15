import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "./providers/NextAuthProvider";
import { Session } from "next-auth";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import Footer from "./components/Footer";
import ClientProviders from "./providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Play tic-tac-toe.",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const darkModeCookie: boolean = JSON.parse(
    cookies().get("darkMode")?.value ?? "true"
  );
  return (
    <html
      lang="en"
      className={`${
        darkModeCookie ? "dark " : ""
      }  overflow-y-auto overflow-x-clip`}
      style={{ colorScheme: "dark" }}
    >
      <body
        className={`${inter.className} relative dark:text-white text-black dark:bg-zinc-950 bg-zinc-50 flex flex-col items-center w-full px-2 min-h-screen h-full pb-24`}
      >
        <NextAuthProvider session={session}>
          <ClientProviders>
            <Toaster
              containerClassName="!z-[999999]"
              toastOptions={{
                className:
                  "dark:!bg-zinc-950 !bg-zinc-50 dark:!text-white !text-black",
                position: "bottom-center",
              }}
            />
            <Navbar />
            {children}
            <Footer />
          </ClientProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
