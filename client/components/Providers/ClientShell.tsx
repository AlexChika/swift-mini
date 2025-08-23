"use client";
import { syncClock } from "@/lib/helpers";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    swtf_offset: number;
  }
}

export default function ClientShell({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function runSync() {
      const offset = await syncClock();
      window.swtf_offset = offset;
      console.log("Clock offset synced:", offset);
    }
    runSync();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
