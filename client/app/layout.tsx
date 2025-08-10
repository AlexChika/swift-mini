import "./globals.css";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import Provider from "@/components/Providers/Provider";
import { getAuthOptions } from "@/lib/api/nextAuth";
import { getServerTheme } from "@/components/Providers/getServerTheme";
import Layout from "@/components/layout/RootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swift Mini",
  description: "Chat Swiftly with friends and in groups."
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await getServerSession(getAuthOptions());
  const theme = await getServerTheme();

  return (
    <html className={`${inter.className} ${theme || ""}`} lang="en">
      <body>
        <Provider defaultTheme="system" serverTheme={theme} session={session}>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
}
