import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NotFound from "@/components/layout/NotFound";
import { getServerTheme } from "@/components/Providers/getServerTheme";
import NotFoundProvider from "@/components/Providers/NotFoundProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swift Mini | Not Found",
  description: "This page does not exist. The link you followed may be broken."
};

export default async function GlobalNotFound() {
  const serverTheme = await getServerTheme();

  return (
    <html className={`${inter.className} ${serverTheme || ""}`} lang="en">
      <body>
        <NotFoundProvider serverTheme={serverTheme}>
          <NotFound />
        </NotFoundProvider>
      </body>
    </html>
  );
}
