import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/api/nextAuth";
import Layout from "@/components/layout/RootLayout";
import Provider from "@/components/Providers/Provider";
import { getServerTheme } from "@/components/Providers/getServerTheme";
import { syncClock } from "@/lib/helpers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swift Mini",
  description: "Chat Swiftly with friends and in groups."
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const session = await auth();
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
