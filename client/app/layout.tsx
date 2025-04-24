import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import Provider from "@/components/Providers/Provider";
// import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerTheme } from "@/components/Providers/getServerTheme";
import { getAuthOptions } from "@/lib/api/nextAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swift Mini",
  description: "Chat Swiftly with friends and in groups.",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await getServerSession(getAuthOptions());
  const theme = await getServerTheme("light");

  return (
    <html className={`${inter.className} ${theme}`} lang="en">
      <body>
        <Provider theme={theme} session={session}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
