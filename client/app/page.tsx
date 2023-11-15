"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  console.log({ session });

  return (
    <main className="red">
      {session?.user ? (
        <button onClick={() => signOut()}> Sign Out</button>
      ) : (
        <button onClick={() => signIn("google")}> Sign In</button>
      )}
    </main>
  );
}
