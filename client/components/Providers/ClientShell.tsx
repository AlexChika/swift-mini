"use client";
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
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
