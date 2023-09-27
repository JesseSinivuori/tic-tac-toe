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
    cookies().get("darkMode")?.value ?? "true",
  );
  return (
    <html
      lang="en"
      className={`${darkModeCookie ? "dark" : ""}  `}
      style={{ colorScheme: "dark" }}
    >
      <body
        className={`${inter.className} relative flex h-full min-h-screen w-full flex-col items-center bg-zinc-50 pb-24 text-black dark:bg-zinc-950 dark:text-white`}
      >
        <NextAuthProvider session={session}>
          <ClientProviders darkModeCookie={darkModeCookie}>
            <Toaster
              containerClassName="!z-[999999]"
              toastOptions={{
                className:
                  "dark:!bg-zinc-950 !bg-zinc-50 dark:!text-white !text-black",
                position: "bottom-center",
              }}
            />
            <Navbar />
            <main className="flex h-full w-full max-w-[1000px] flex-col items-center px-4">
              {children}
            </main>
            <Footer />
          </ClientProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
