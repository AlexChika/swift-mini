"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  console.log({ session });

  return (
    <main className="red p-5">
      <Image src={"/icon.png"} alt="swift logo" width={70} height={60} />
      {session?.user ? (
        <button onClick={() => signOut()}> Sign Out</button>
      ) : (
        <button onClick={() => signIn("google")}> Sign In</button>
      )}
    </main>
  );
}
