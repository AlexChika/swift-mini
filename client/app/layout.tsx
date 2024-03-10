import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Provider from "./Provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swift Mini",
  description: "Chat Swiftly with friends and in groups.",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
